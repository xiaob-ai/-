import { Controller, Get, Post, Body, Query, UseGuards, Param } from '@nestjs/common';
import { ChatService } from './chat.service';
import { AuthGuard } from '../auth/auth.guard';


@Controller('chat')
@UseGuards(AuthGuard)
export class ChatController {
    constructor(private chatService: ChatService) {}


}