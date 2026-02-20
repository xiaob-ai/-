import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AnswerModule} from "../answer/answer.module";
import {UsersModule} from "../users/users.module";
import {Comment} from "./entity/comment.entity";

@Module({
  imports: [
      TypeOrmModule.forFeature([Comment]),
      AnswerModule,
      UsersModule
  ],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
