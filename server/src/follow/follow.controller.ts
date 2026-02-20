import {Body, Controller, Delete, Get, Post, Put, Query} from '@nestjs/common';
import { FollowService } from './follow.service';
import type{CreateFollowQuestionDto} from "./dto/create-follow-question.dto";
import type{CreateFollowUserDto} from "./dto/create-follow-user.dto";
import {FollowQuestion} from "./entity/followQuestion.entity";
import {FollowUser} from "./entity/followUser.entity";

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Put('followQuestion')
  async followQuestion(@Body('dto') createFollowQuestionDto:CreateFollowQuestionDto) {
    return this.followService.followQuestion(createFollowQuestionDto);
  }
  @Put('followUser')
  async followUser(@Body('dto') createFollowUserDto:CreateFollowUserDto) {
    return this.followService.followUser(createFollowUserDto);
  }
  @Delete('cancelFollowQuestion')
  async cancelFollowQuestion(@Body('dto') createFollowQuestionDto:CreateFollowQuestionDto) {
    return await this.followService.cancelFollowQuestion(createFollowQuestionDto);
  }
  @Delete('cancelFollowUser')
  async cancelFollowUser(@Body('dto') createFollowUserDto:CreateFollowUserDto) {
    return await  this.followService.cancelFollowUser(createFollowUserDto);
  }
  @Get('user/following')
  async getByUserId(@Query('userId') userId: string) {
    return await this.followService.findFollowUsers(userId);
  }
  @Get('question/following')
  async getFollowQuestionsByUserId(@Query('questionId') questionId: string) {
    return await this.followService.findFollowQuestions(questionId);
  }

}
