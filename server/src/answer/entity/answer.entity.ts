import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('answers')
export class Answer{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'text'})
    content: string;

    @Column({type: 'varchar', length: 36})
    questionId: string;

    @Column({type: 'text'})
    questionTitle: string;

    @Column({type: 'varchar', length: 36})
    authorId: string;

    @Column({type: 'int', unsigned: true, default: 0})
    voteUp: number;

    @Column({type: 'int', unsigned: true, default: 0})
    voteDown: number;

    @Column({type: 'boolean', default: false})
    isCollapsed: boolean;

    @Column({type: 'int', unsigned: true, default: 0})
    commentCount: number;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;

    @Column({type: 'enum', enum: ['normal', 'deleted'], default: 'normal'})
    status: 'normal' | 'deleted'
}