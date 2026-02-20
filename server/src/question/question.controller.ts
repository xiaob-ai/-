import {Body, Controller, Get, Param, ParseIntPipe, Put, Query} from '@nestjs/common';
import {QuestionService} from "./question.service";
import {CreateQuestionDto} from "./dto/create-question.dto";

@Controller('question')
export class QuestionController {
    constructor(private readonly questionService: QuestionService) {
    }

    @Put('create')
    async create(@Body() questionData: CreateQuestionDto){
        return await this.questionService.createQuestion(questionData);
    }

    @Get('topic')
    async findTopicQuestions(@Query('topicId') topicId: string){
        return await this.questionService.findTopicQuestions(topicId);
    }

    @Get('latest')
    async findLatestQuestions(){
        return await this.questionService.findLatestQuestions();
    }

    @Get('search')
    async findOne(@Query('name') name: string){
        return await this.questionService.findByName(name)
    }

    @Get('recommend')
    async findRecommendQuestions(@Query('offset' ,ParseIntPipe) offset: number, @Query('limit',ParseIntPipe) limit: number){
        return await this.questionService.findByRange(offset, limit)
    }
    @Get(':id')
    async findQuestionBy(@Param('id') id: string){
        return await this.questionService.findOne(id);
    }



}
