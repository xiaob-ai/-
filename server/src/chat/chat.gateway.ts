import {ConnectedSocket, MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer} from '@nestjs/websockets'
import {ChatService} from "./chat.service";
import {UsersService} from "../users/users.service";
import {Logger, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Server} from "socket.io";
import {JwtPayload} from "../auth/types";
import {User} from "../users/entity/user.entity";
import {AuthenticatedSocket} from "../auth/types";
import {JoinChatDto} from "./dto/join-chat.dto";
import {SendMessageDto} from "./dto/send-message.dto";

@WebSocketGateway({
    cors: {
        origin: '*'
    }
})
export class ChatGateway  {
    @WebSocketServer()
    server: Server;
    private readonly logger = new Logger('ChatGateway');
    // 用户id与socket id 映射
    private users: Map<string, string> = new Map();
    // socket id 与用户id 映射
    private sockets: Map<string, string> = new Map();
    constructor(private readonly chatService: ChatService,private readonly userService: UsersService,private readonly jwtService: JwtService) {
    }
    /**
     * 用户连接上
     * @param client client
     * @param args
     */
    async handleConnection(client:AuthenticatedSocket, ...args: any[]) {
        const token = this.extractToken(client);
        if (!token) {
            client.emit('error', '用户未登录');
            client.disconnect();
            this.logger.warn('用户未登录');
            return;
        }
        const payload :JwtPayload= await this.validateToken(token);
        //获取完整用户信息
        const user:User|null =await this.userService.findOne(payload.userId);
        if (!user) {
            client.emit('error', '用户不存在');
            client.disconnect();
            this.logger.warn('用户不存在');
            return;
        }
        client.user =user;
        this.logger.log(`用户 ${user.username} 已连接,socket${client.id}`);
        await this.sendInitialData(client);

    }
    async handleDisconnect(client: AuthenticatedSocket) {
        const userId = this.users.get(client.id);
        if (userId) {
            this.users.delete(client.id);
            this.sockets.delete(userId);
        }
        this.logger.log(`用户 ${userId} 已断开连接,socket${client.id}`);

    }
    /**
     * 加入私聊会话
     */
    @SubscribeMessage('join_chat')
    async handleJoinChat(
        @MessageBody() data: JoinChatDto,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        const userId = this.getUserId(client);
        const { targetUserId } = data;

        this.logger.debug(`用户 ${userId} 尝试加入与 ${targetUserId} 的聊天`);

        // 验证不能和自己聊天
        if (targetUserId === userId) {
            return {
                success: false,
                error: '不能与自己发起聊天',
                code: 'SELF_CHAT',
            };
        }

        // 验证目标用户存在
        const targetUser = await this.userService.findOne(targetUserId);
        if (!targetUser) {
            return {
                success: false,
                error: '目标用户不存在',
                code: 'USER_NOT_FOUND',
            };
        }

        // 生成房间ID
        const roomId = this.chatService.generateConversationKey(userId, targetUserId);

        // 离开之前的房间（可选：限制同时只能在一个活跃聊天中）
        // client.rooms.forEach(room => {
        //     if (room !== client.id) client.leave(room);
        // });

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

        // 返回成功响应
        return {
            success: true,
            roomId,
            targetUser: {
                id: targetUser.id,
                username: targetUser.username,
                avatar: targetUser.avatar,
                isOnline: this.isUserOnline(targetUserId),
            },
            history: history, // 正序排列
            unreadCount: 0, // 已标记为已读
        };
    }
    /**
     * 发送消息
     */
    @SubscribeMessage('send_message')
    async handleSendMessage(
        @MessageBody() data: SendMessageDto,
        @ConnectedSocket() client: AuthenticatedSocket,
    ) {
        const userId = this.getUserId(client);
        const { content, receiverId } = data;
        if(userId === receiverId){
            return {
                success: false,
                error: '不能给自己发送消息',
                code: 'SELF_MESSAGE',
            };
        }
        try{
            const res= await this.chatService.sendMessage(userId, receiverId, content);
            const roomId = this.chatService.generateConversationKey(userId, receiverId);
            // 构建消息负载
            const messagePayload = {
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
            this.logger.debug(`消息已广播到房间 ${roomId}: ${res.id}`);
            return {
                success: true
            }
        }
        catch (error) {
            this.logger.error(error);
            return {
                success: false,
                error: '发送消息失败',
                code: 'SEND_MESSAGE_FAILED',
            }
        }


    }

    async validateToken(token: string) {
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }
        // 移除 Bearer 前缀
        token = token.replace('Bearer ', '');
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
            client.handshake.auth?.token ||
            client.handshake.headers?.authorization || null
        );
    }
    private async sendInitialData(client: AuthenticatedSocket) {
        const userId = client.user!.id;
        // 发送会话列表
        const conversations = await this.chatService.getConversations(userId);
        client.emit('init_data', {
            user: client.user,
            conversations: conversations.map(c => ({
                ...c,
                otherUserOnline: this.isUserOnline(c.otherUserId),
            })),
            serverTime: new Date().toISOString(),
        });
    }

    private isUserOnline(userId: string): boolean {
        return this.sockets.has(this.users.get(userId));
    }

    private getUserId(client: AuthenticatedSocket): string {
        return client.user!.id;
    }

    // 广播会话更新
    private async broadcastConversationUpdate(userId: string, otherUserId: string) {
        const socketId = this.users.get(userId);
        if (!socketId) return;

        // 获取最新会话信息
        const conversationKey = this.chatService.generateConversationKey(userId, otherUserId);
        const messages = await this.chatService.getMessageHistory(userId, otherUserId);
        const lastMessage = messages[0];

        const otherUser = await this.userService.findOne(otherUserId);

        this.server.to(socketId).emit('conversation_updated', {
            conversationKey,
            otherUser: {
                id: otherUser!.id,
                username: otherUser!.username,
                avatar: otherUser!.avatar,
                isOnline: this.isUserOnline(otherUserId),
            },
            updatedAt: new Date().toISOString(),
        });
    }
}
