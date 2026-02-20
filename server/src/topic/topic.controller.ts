import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import { TopicService } from './topic.service';
import {Topic} from "./entity/topic.entity";
import {Public} from "../auth/decorators/public.decorator";

@Controller('topic')
export class TopicController {
  constructor(private readonly topicService: TopicService) {}

  @Put('create')
  create(@Body() body) {
    const topic = new Topic();
    const { name, description, parentId} = body;
    if( !name){
      throw new Error('请填写话题名称');
    }
      topic.name = name;
    topic.description = description || null;
    topic.parentId = parentId || null;
    return this.topicService.create(topic);
  }



  //随机获取话题
  @Public()
  @Get('random')
  async random() {
    return this.topicService.random();
  }

  @Get('search')
  async findByName(@Query() query) {
    const { name } = query;
    return this.topicService.findByName(name);
  }

  @Get('searchMore')
  async findByNameMore(@Query() query) {
    const { name } = query;
    return this.topicService.findByNameMore(name);
  }

  @Public()
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.topicService.findOne(id);
  }



}
