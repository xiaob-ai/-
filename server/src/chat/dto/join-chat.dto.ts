import { IsUUID } from 'class-validator';

export class JoinChatDto {
    @IsUUID()
    targetUserId: string; // 要聊天的目标用户ID
    @IsUUID()
    userId: string;
}