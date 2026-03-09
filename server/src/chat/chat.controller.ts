import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}

    // 获取会话列表
    @Get('conversations')
    async getConversations( userId: string) {
        return this.chatService.getConversations(userId);
    }

    // 获取与某用户的历史消息
    @Get('history/:userId')
    async getHistory(
       currentUserId: string,
        @Param('userId') otherUserId: string,
        @Query('cursor') cursor?: string,
        @Query('limit') limit?: string,
    ) {
        return this.chatService.getMessageHistory(
            currentUserId,
            otherUserId,
            cursor,
            limit ? parseInt(limit, 10) : 20,
        );
    }

    // 获取未读消息数
    @Get('unread-count')
    async getUnreadCount(userId: string) {
        const count = await this.chatService.getUnreadCount(userId);
        return { count };
    }
}