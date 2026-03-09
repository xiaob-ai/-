import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    UpdateDateColumn,
    CreateDateColumn,
    Index,
} from 'typeorm';

@Entity('conversations')
export class Conversation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index({ unique: true })
    @Column()
    conversationKey: string; // 格式: userId1_userId2 (按UUID排序)

    @Column({ type: 'uuid' })
    user1Id: string;

    @Column({ type: 'uuid' })
    user2Id: string;

    @Column({ type: 'uuid', nullable: true })
    lastMessageId: string;

    @UpdateDateColumn()
    updatedAt: Date;

    @CreateDateColumn()
    createdAt: Date;
}