import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('followquestion')
export class FollowQuestion {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 36})
    questionId: string;

    @Column({type: 'varchar', length: 36})
    userId: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}