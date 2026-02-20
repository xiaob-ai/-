import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity('followuser')
export class FollowUser {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 36})
    userId: string;

    @Column({type: 'varchar', length: 36})
    followUserId: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;
}