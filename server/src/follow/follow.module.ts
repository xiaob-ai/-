import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import {FollowUser} from "./entity/followUser.entity";
import {FollowQuestion} from "./entity/followQuestion.entity";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UsersModule} from "../users/users.module";
import {QuestionModule} from "../question/question.module";

@Module({
  imports: [
      TypeOrmModule.forFeature([FollowUser,FollowQuestion]),
      QuestionModule,
      UsersModule
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
