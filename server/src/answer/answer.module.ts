import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnswerController } from './answer.controller';
import {Answer} from "./entity/answer.entity";
import {AnswerService} from "./answer.service";
import {UsersModule} from "../users/users.module";
import {QuestionModule} from "../question/question.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Answer]),
      QuestionModule,
      UsersModule,
  ],
  controllers: [AnswerController],
  providers: [AnswerService],
    exports: [AnswerService],
})
export class AnswerModule {}
