import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {ChatGateway} from "./chat.gateway";
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { Message } from './entities/message.entity';
import { Conversation } from './entities/conversation.entity';
import { UsersModule } from '../users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Message, Conversation]),
        UsersModule,
    ],
    providers: [ChatGateway, ChatService],
    controllers: [ChatController],
    exports: [ChatService],
})
export class ChatModule {}