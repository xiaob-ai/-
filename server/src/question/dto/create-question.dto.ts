// src/questions/dto/create-question.dto.ts
import { IsString, IsArray, IsOptional, ArrayMinSize } from 'class-validator';

export class CreateQuestionDto {
    @IsString()
    title: string;

    @IsOptional()
    @IsString()
    detail?: string;

    @IsArray()
    @ArrayMinSize(1)
    topicIds?: string[];

    @IsString()
    authorId: string;
}