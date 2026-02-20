import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {Like} from "./entity/like.entity";
import {AnswerModule} from "../answer/answer.module";
import {UsersModule} from "../users/users.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([Like]),
      AnswerModule,
      UsersModule,
  ],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
