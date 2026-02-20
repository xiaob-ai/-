import {Body, Controller, Delete, Get, Post, Put, Query, Req} from '@nestjs/common';
import { LikeDto } from './dto/like.dto';
import { LikeService } from './like.service';

@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  @Put()
  async like(@Body('likeData') likeData:LikeDto) {

    return await this.likeService.addLike(likeData);
  }
  @Delete('cancel')
  async cancelLike(@Body() likeData:LikeDto) {
    return await this.likeService.cancelLike(likeData);
  }

  @Get('isLike')
  async getLikesByUserId(@Query('userId') userId: string, @Query('answerId') answerId: string) {
    return await this.likeService.getLikesByUserIdAndAnswerId(userId, answerId);
  }

  @Get('getLikesByAnswerId')
  async getLikesByAnswerId(@Query('answerId') answerId: string) {
    return await this.likeService.getLikesByAnswerId(answerId);
  }



}
