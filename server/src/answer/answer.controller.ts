import {Body, Controller, Get, Put, Query} from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import {AnswerService} from "./answer.service";
import {Public} from "../auth/decorators/public.decorator";

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {

  }

  @Public()
  @Put('create')
  async createAnswer(@Body("answerData") createAnswerDto: CreateAnswerDto) {
    console.log(createAnswerDto);

    return await this.answerService.createAnswer(createAnswerDto);
  }





  @Public()
  @Get('best')
  async getBestAnswerByQuestionId(@Query('questionId') questionId:string) {
    return await this.answerService.getBestAnswerByQuestionId(questionId);
  }

  @Public()
  @Get('all')
  async getAllAnswersByQuestionId(@Query('questionId') questionId:string) {
    return await this.answerService.getAnswersByQuestionId(questionId);
  }


}
