import { Module } from '@nestjs/common';
import {ConfigModule} from "@nestjs/config";
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import * as process from "node:process";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./users/entity/user.entity";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth/auth.guard";
import { QuestionModule } from './question/question.module';
import { TopicModule } from './topic/topic.module';
import {Topic} from "./topic/entity/topic.entity";
import {Question} from "./question/entity/question.entity";
import { AnswerModule } from './answer/answer.module';
import { Answer } from "./answer/entity/answer.entity";
import { LikeModule } from './like/like.module';
import {Like} from "./like/entity/like.entity";
import { CommentModule } from './comment/comment.module';
import { Comment } from "./comment/entity/comment.entity";
import { FollowModule } from './follow/follow.module';
import {FollowUser} from "./follow/entity/followUser.entity";
import { FollowQuestion } from "./follow/entity/followQuestion.entity";
import { ChatModule } from './chat/chat.module';
import {Conversation} from "./chat/entities/conversation.entity";
import {Message} from "./chat/entities/message.entity";
@Module({
  imports: [
      ConfigModule.forRoot(
          {
              isGlobal: true,
              envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
          }
      ),
      TypeOrmModule.forRoot(
          {
              type: 'mysql',
              host: process.env.DB_HOST,
              port: parseInt(process.env.DB_PORT || '3306'),
              username: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
              synchronize: true,
              entities: [User,Topic,Question,Answer,Like,Comment,FollowQuestion,FollowUser,Conversation,Message],
              migrationsRun:true,
          }
      ),
      AuthModule,
      UsersModule,
      QuestionModule,
      TopicModule,
      AnswerModule,
      LikeModule,
      CommentModule,
      FollowModule,
      ChatModule
  ],
  controllers: [AppController],
  providers: [AppService,{
      provide: APP_GUARD,
      useClass: AuthGuard,
  }]
})
export class AppModule {}
