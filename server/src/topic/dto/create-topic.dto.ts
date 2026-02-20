// src/topics/dto/create-topic.dto.ts
import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateTopicDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsOptional()
    @IsUUID()
    parentId?: string;
}