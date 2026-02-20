import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: 'likes'})
export class Like {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 36})
    answerId: string;

    @Column({type: 'varchar', length: 36})
    userId: string;

    @Column({type: 'boolean'})
    isLike: boolean;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    updatedAt: Date;


}