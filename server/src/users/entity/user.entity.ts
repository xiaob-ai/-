import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

import { IsEmail, IsPhoneNumber, IsEnum, Length, IsOptional, IsBoolean, IsInt, Min } from 'class-validator';


export type UserRole = 'user' | 'admin' | 'super';

@Entity({ name: 'users' })
export class User {
    /* ---------- 基础字段 ---------- */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 30 })
    @Length(3, 30)
    username: string;

    @Column({ type:"varchar",unique: true, nullable: true, length: 320 })
    @IsOptional()
    @IsEmail({}, { message: '邮箱格式不正确' })
    email?: string | null;

    @Column({ unique: true, length: 20 })
    @IsPhoneNumber('CN', { message: '手机号格式不正确' })
    phone: string;

    @Column({ name: 'password_hash',type: 'varchar' })
    passwordHash: string;

    @Column({ type: 'text'})
    avatar: string;

    @Column({ type: 'varchar', length: 120, nullable: true })
    @IsOptional()
    headline?: string | null;

    @Column({ type: 'text', nullable: true })
    @IsOptional()
    bio?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    location?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    business?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    school?: string | null;

    @Column({ type: 'varchar', length: 100, nullable: true })
    @IsOptional()
    major?: string | null;

    /* ---------- 冗余计数 ---------- */
    @Column({ name: 'follower_count', type: 'int', unsigned: true, default: 0 })
    @IsInt()
    @Min(0)
    followerCount: number;

    @Column({ name: 'following_count', type: 'int', unsigned: true, default: 0 })
    @IsInt()
    @Min(0)
    followingCount: number;

    @Column({ name: 'vote_count', type: 'int', unsigned: true, default: 0 })
    @IsInt()
    @Min(0)
    voteCount: number;

    @Column({ name: 'thank_count', type: 'int', unsigned: true, default: 0 })
    @IsInt()
    @Min(0)
    thankCount: number;

    /* ---------- 状态 ---------- */
    @Column({ name: 'is_email_verified', type: 'boolean', default: false })
    @IsBoolean()
    isEmailVerified: boolean;

    @Column({ type: 'enum', enum: ['user', 'admin', 'super'], default: 'user' })
    @IsEnum(['user', 'admin', 'super'])
    role: UserRole;

    /* ---------- 时间戳 ---------- */
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}