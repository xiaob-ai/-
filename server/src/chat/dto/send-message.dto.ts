import {IsString, IsUUID, IsNotEmpty, IsBoolean} from 'class-validator';

export class SendMessageDto {
    @IsUUID()
    receiverId: string;
    @IsUUID()
    senderId: string;
    @IsString()
    @IsNotEmpty()
    content: string;
}

export class TypingDto {
    @IsUUID()
    receiverId: string;

    @IsBoolean()
    isTyping: boolean;
}