import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "./entities/message.entity";
import {Not, Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {Conversation} from "./entities/conversation.entity";
import {UsersService} from "../users/users.service";

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,@InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,private readonly userService: UsersService) {

    }

    async getConversations(userId: string) {
        const conversations = await this.conversationRepository.find({
            where: [
                { user1Id: userId },
                { user2Id: userId },
            ],
        });
        return conversations.map(c => ({
            ...c,
            otherUserId: c.user1Id === userId ? c.user2Id: c.user1Id,

        } ));
    }
    //创建聊天会话
    async createConversation(userId: string, otherUserId: string) {
        const conversationKey = this.generateConversationKey(userId, otherUserId);
        const conversation = await this.conversationRepository.findOne({
            where: {
                conversationKey,
            },
        });
        if (conversation) {
            return conversation;
        }
        return await this.conversationRepository.save({
            conversationKey,
            user1Id: userId,
            user2Id: otherUserId,
        });
    }

    // 获取聊天记录，包括发送者和接收者信息
    async getMessageHistory(userId: string, otherUserId: string) {
        const conversationKey = this.generateConversationKey(userId, otherUserId);
        const messages = await this.messageRepository.find({
            where: {
                conversationKey,
            },
            order: {
                createdAt: 'ASC',
            },
        });
        return messages
    }


    // 获取全部未读消息
    async getUnreadMessages(userId: string) {
        return await this.messageRepository.find({
            where: {
                receiverId: userId,
                isRead: false
            }
            ,order: {
                createdAt: 'DESC',
            }
        })
    }


    // 根据消息ID批量更新已读状态
    async markAsRead(strings: string[]) {
        await this.messageRepository.update(strings, {
            isRead: true,
        });
    }

    async sendMessage(userId: string, receiverId: string, content: string) {
        const conversationKey = this.generateConversationKey(userId, receiverId);
        const res= await this.messageRepository.save({
            conversationKey,
            senderId: userId,
            receiverId,
            content:content.trim(),
        });

        await this.updateLastMessageId(conversationKey, res.id);
        return res;
    }
    //更新会话lastMessageId
    async updateLastMessageId(conversationKey: string, messageId: string) {
        if(!messageId){
            return;
        }
        await this.conversationRepository.update({
            conversationKey,
        }, {
            lastMessageId: messageId,
        });
    }


    //判断消息内容是否有效
    isValidMessage(content: string) {
        if (!content) {
            return false;
        }
        content = content.trim();
        return content.length > 0 && content.length <= 500;

    }

    async getLastMessage(conversationKey: string) {

        return await this.messageRepository.findOne({
            where: {
                conversationKey,
            },
            order: {
                createdAt: 'DESC',
            },
        });
    }
    // 获取发送者非用户的未读信息数
    async getUnreadCount(conversationKey: string, userId: string) {
      return  await this.messageRepository.count({
            where: {
                conversationKey,
                isRead: false
                ,senderId: Not(userId)
            }
        })
    }
     generateConversationKey(user1Id: string, user2Id: string) {
        return [user1Id, user2Id].sort().join('_');

    }
}