// src/questions/entities/question.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToMany,
    JoinTable,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
} from 'typeorm';


export type QuestionStatus = 'open' | 'closed' | 'deleted';

@Entity({ name: 'questions' })
export class Question {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'text' })
    title: string;

    @Column({ type: 'text', nullable: true })
    detail?: string | null;

    @Column({ type: 'int', unsigned: true, default: 0 })
    viewCount: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    answerCount: number;

    /* 仅存关联 ID 数组（可选，查询用） */
    @Column({ name: 'topic_ids', type: 'simple-json', nullable: true })
    topicIds: string[];

    @Column({name : 'author_id', type: 'varchar', length: 36})
    authorId: string;

    @Column({ type: 'int', unsigned: true, default: 0 })
    followerCount: number;

    @Column({ type: 'int', unsigned: true, default: 0 })
    commentCount: number;

    @Column({ type: 'enum', enum: ['open', 'closed', 'deleted'], default: 'open' })
    status: QuestionStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}