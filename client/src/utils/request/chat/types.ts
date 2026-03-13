export interface SendMessageDto {
    receiverId: string;
    content: string;
}

export interface TypingDto {
    receiverId: string;
    isTyping: boolean;
}


export interface JoinChatDto {
    targetUserId: string; // 要聊天的目标用户ID
}

export interface Message {

    id: string;


    senderId: string;


    receiverId: string;


    content: string;

    isRead: boolean;

    createdAt: Date;

    conversationKey: string;

}


export interface Conversation {
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
export interface ChatUser {
    id: string;
    username: string;
    avatar: string;
    isOnline: boolean;
}