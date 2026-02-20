// src/topics/entities/topic.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';


@Entity({ name: 'topics' })
export class Topic {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 100 })
    name: string;

    @Column({ type: 'text', nullable: true })
    description?: string | null;

    @Column({ name: 'question_count', type: 'int', unsigned: true, default: 0 })
    questionCount: number;

    @Column({ name: 'follower_count', type: 'int', unsigned: true, default: 0 })
    followerCount: number;

    @Column({ name: 'parent_id', nullable: true, type: 'varchar', length: 36 })
    parentId?: string | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}