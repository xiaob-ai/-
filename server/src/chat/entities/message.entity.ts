import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entity/user.entity';

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid' })
    senderId: string;

    @Index()
    @Column({ type: 'uuid' })
    receiverId: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    isRead: boolean;

    @CreateDateColumn()
    createdAt: Date;

    // 用于快速查询会话：将两个用户ID按字典序排序后拼接
    @Index()
    @Column()
    conversationKey: string;


}