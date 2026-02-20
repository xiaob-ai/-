import {Body, Controller, Get, Put, Query} from '@nestjs/common';
import { CreateCommentDto } from './dto/create-commment.dto';
import { CommentService } from './comment.service';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {

  }
  @Put('create')
  async createComment(@Body() commentData: CreateCommentDto) {
    return this.commentService.createComment(commentData);
  }
  @Get('answer')
  async getCommentsByAnswerId(@Query('answerId') answerId: string) {
    return this.commentService.getCommentsByAnswerId(answerId);
  }
}
