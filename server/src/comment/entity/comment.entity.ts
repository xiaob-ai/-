import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";


@Entity({name: 'comments'})
export class Comment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 36})
    answerId: string;

    @Column({type: 'varchar', length: 36})
    userId: string;

    @Column({type: 'text' })
    content: string;

    @Column({type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
    createdAt: Date;


}