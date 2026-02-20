import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionService } from './question.service';
import {Question} from "./entity/question.entity";
import {QuestionController} from "./question.controller";
import {TopicModule} from "../topic/topic.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Question]),
      TopicModule
  ],
  controllers: [QuestionController],
  providers: [QuestionService],
    exports:[QuestionService]
})
export class QuestionModule {}
