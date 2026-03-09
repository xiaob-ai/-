import {InjectRepository} from "@nestjs/typeorm";
import {Message} from "./entities/message.entity";
import {Repository} from "typeorm";
import {Injectable} from "@nestjs/common";
import {Conversation} from "./entities/conversation.entity";
import {UsersService} from "../users/users.service";

@Injectable()
export class ChatService {
    constructor(@InjectRepository(Message) private readonly messageRepository: Repository<Message>,@InjectRepository(Conversation) private readonly conversationRepository: Repository<Conversation>,@Injectable() private readonly userService: UsersService) {

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
    generateConversationKey(user1Id: string, user2Id: string) {
        return [user1Id, user2Id].sort().join('_');
    }

    // 根据消息ID批量更新已读状态
    async markAsRead(strings: string[]) {
        await this.messageRepository.update(strings, {
            isRead: true,
        });

    }

    async sendMessage(userId: string, receiverId: string, content: string) {
        const conversationKey = this.generateConversationKey(userId, receiverId);
        return await this.messageRepository.save({
            conversationKey,
            senderId: userId,
            receiverId,
            content:content.trim(),
        });
    }
    //判断消息内容是否有效
    async isValidMessage(content: string) {
        if (!content) {
            return false;
        }
        content = content.trim();
        return content.length > 0 && content.length <= 500;

    }
}