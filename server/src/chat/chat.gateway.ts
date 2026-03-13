import {
    ConnectedSocket,
    MessageBody,
    OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WebSocketServer
} from '@nestjs/websockets'
import {ChatService} from "./chat.service";
import {UsersService} from "../users/users.service";
import {Logger, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Server} from "socket.io";
import {JwtPayload} from "../auth/types";
import {User} from "../users/entity/user.entity";
import type {AuthenticatedSocket} from "../auth/types";
import {JoinChatDto} from "./dto/join-chat.dto";
import {SendMessageDto} from "./dto/send-message.dto";
import {Conversation} from "./entities/conversation.entity";
import {Message} from "./entities/message.entity";

@WebSocketGateway(3001,{
    cors: {
        origin: '*'
    },
    transports: ['websocket'],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger('ChatGateway');
    // 用户id与socket id 映射
    private users: Map<string, string> = new Map();
    // socket id 与用户id 映射
    private sockets: Map<string, string> = new Map();
    constructor(private readonly chatService: ChatService,private readonly userService: UsersService,private readonly jwtService: JwtService) {
    }

    afterInit(){
        this.logger.log('WebSocket server initialized');
    }
    /**
     * 用户连接上
     * @param client client
     * @param args
     */
    async handleConnection(client:AuthenticatedSocket, ...args: any[]) {
        const token = this.extractToken(client);
        if (!token) {
            client.disconnect();
            this.logger.warn('用户未登录');
            return {
                success: false,
                error: '用户未登录'
            }
        }
        const payload :JwtPayload= await this.validateToken(token);
        //获取完整用户信息
        const user:User|null =await this.userService.findOne(payload.userId);
        if (!user) {

            client.disconnect();
            this.logger.warn('用户不存在');
             return {
                 success: false,
                  error: '用户不存在'
             }
        }
        client.user ={id: user.id,username: user.username};
        this.logger.log(`用户 ${user.username} 已连接,socket${client.id}`);
        const data={userId:user.id};
        this.sockets.set(user.id, client.id);
        this.users.set(client.id, user.id);

        //广播用户上线
        this.server.emit('userOnline', data as any);

        this.sendInitialData(client);

    }
    async handleDisconnect(client: AuthenticatedSocket) {
        const userId = this.users.get(client.id);
        this.logger.log(`用户 ${userId} 已断开连接,socket${client.id}`);
        if (userId) {
            this.users.delete(client.id);
            this.sockets.delete(userId);
        }

    }
    /**
     * 加入私聊会话
     */
    @SubscribeMessage('joinChat')
    async handleJoinChat(
        @MessageBody() data: JoinChatDto,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {


        const { targetUserId,userId } = data;
        this.logger.debug(`用户 ${userId} 尝试加入与 ${targetUserId} 的聊天`);

        // 验证不能和自己聊天
        if (targetUserId === userId) {
            client.emit('error', '不能和自己聊天');
            return
        }

        // 验证目标用户存在
        const targetUser = await this.userService.findOne(targetUserId);
        if (!targetUser) {
            client.emit('error', '目标用户不存在');
            return
        }

        // 生成房间ID
        const roomId = this.chatService.generateConversationKey(userId, targetUserId);
        await this.chatService.createConversation(userId, targetUserId);
        // 加入新房间
        client.join(roomId);
        this.logger.debug(`用户 ${userId} 加入房间 ${roomId}`);

        // 获取历史消息
        const history = await this.chatService.getMessageHistory(userId, targetUserId);

        // 标记消息为已读
        const unreadMessages = history.filter(
            msg => msg.receiverId === userId && !msg.isRead
        );

        if (unreadMessages.length > 0) {
            await this.chatService.markAsRead(unreadMessages.map(m => m.id));
        }
        const payload = {
            success: true,
            conversationId: roomId,
            targetUser: {
                id: targetUser.id,
                username: targetUser.username,
                avatar: targetUser.avatar,
                isOnline: this.isUserOnline(targetUserId),
            },
            history: history, // 正序排列
        };
        // 返回成功响应
        client.emit('joinChat', payload);
    }
    @SubscribeMessage('isOnline')
    async handleIsOnline(@MessageBody() data: { userId: string }, @ConnectedSocket() client: AuthenticatedSocket){
        const isOnline = this.isUserOnline(data.userId);
        client.emit('isOnline', {  isOnline })
    }


    /**
     * 发送消息
     */
    @SubscribeMessage('send_message')
    async handleSendMessage(
        @MessageBody() data: SendMessageDto,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {

        const { content, receiverId,senderId:userId} = data;
        if(userId === receiverId){
            client.emit('error', '不能给自己发送消息');
        }
        try{
            const res= await this.chatService.sendMessage(userId, receiverId, content);
            const roomId = this.chatService.generateConversationKey(userId, receiverId);
            // 构建消息负载
            const messagePayload:Message = {
                id: res.id,
                senderId: res.senderId,
                receiverId: res.receiverId,
                content: res.content,
                createdAt: res.createdAt,
                isRead: false,
                conversationKey: roomId,
            };
            // 3. 广播到房间（双方都能收到）
            this.server.to(roomId).emit('new_message', messagePayload);
            await this.chatService.updateLastMessageId(roomId, res.id);
            return {
                success: true
            }
        }
        catch (error) {
            this.logger.error(error);
            client.emit('error', '发送消息失败');
        }
    }

    @SubscribeMessage('refreshConversations')
    refreshConversations(@ConnectedSocket() client: AuthenticatedSocket,@MessageBody() data: any) {
        client.user= new User()
        client.user.id = data.userId;
        this.sendInitialData(client);
    }

    async validateToken(token: string) {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        try {
            return await this.jwtService.verifyAsync(token, {
                secret: 'adhagsidgaiuwgqiugequweuqw9eg219usadbg9usgd7', // 或从配置读取
            });
        } catch (error) {
            throw new UnauthorizedException('Invalid token');
        }
    }

    // 从 socket 获取 token
    private extractToken(client: AuthenticatedSocket): string | null {
        // 优先从 auth 获取，其次从 query 获取
        return (
            client.handshake?.auth?.token ||
            client.handshake?.headers?.authorization || null
        );
    }
    private async sendInitialData(client: AuthenticatedSocket) {
        const userId = client.user!.id;
        // 发送会话列表
        const conversations:Conversation[] = await this.chatService.getConversations(userId);

        const  promises= conversations.map(async (conversation) => {
            return await this.addLastMessage(conversation,userId);
        })
        const payload:ConversationWithMessage[] = await Promise.all(promises)
        client.emit('init_data', payload);
    }

    private isUserOnline(userId: string): boolean {
        const  socketId= this.users.get(userId)
        if (!socketId) return false;
        return this.sockets.has(socketId);
    }
    private async addLastMessage(conversation: Conversation,userId){
        const chatterId= conversation.user1Id === userId ? conversation.user2Id : conversation.user1Id;
        const isChatterOnline = this.isUserOnline(chatterId);
        const chatter = await this.userService.findOne(chatterId) as User;
        const lastMessage = await this.chatService.getLastMessage(conversation.conversationKey);
        const unreadCount = await this.chatService.getUnreadCount(conversation.conversationKey,userId);
        const result:ConversationWithMessage= {
            id: conversation.id,
            lastMessage:lastMessage || undefined,
            lastMessageTime: lastMessage?.createdAt,
            online: isChatterOnline,
            userId: chatter.id,
            name: chatter.username,
            avatar: chatter.avatar,
            bio: chatter.bio || undefined,
            unread: unreadCount,

        }
        return result;
    }


}
interface ConversationWithMessage {
    id: string
    userId: string
    name: string
    avatar: string
    lastMessage?: Message
    lastMessageTime?: Date
    unread: number
    online: boolean
    bio?: string
}
