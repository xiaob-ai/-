import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}

    @Get('unread')
    async getUnreadInfo(@Query('userId') userId: string) {
        return await this.chatService.getUnreadMessages(userId);
    }


}