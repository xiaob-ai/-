import { Injectable } from '@nestjs/common';
import {ConflictException} from "@nestjs/common";
import {Topic} from "./entity/topic.entity";
import {Like, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {Public} from "../auth/decorators/public.decorator";

@Injectable()
export class TopicService {
    constructor(@InjectRepository(Topic) private readonly topicRepository: Repository<Topic>) {

    }

    async create(topic: Topic) {
        const exists = await this.topicRepository.findOne({where: {name: topic.name}});
        if (exists) {
            throw new ConflictException('话题已存在');
        }
        return await this.topicRepository.save(topic);
    }


    // 随机获取多个话题

    async random() {
        return await this.topicRepository.find({
            order: {
                questionCount: 'DESC'
            },
            take: 10
        });


    }


    async findOne(id: string) {
        return await this.topicRepository.findOne({where: {id}});
    }

    //修改话题
    async update(id: string, topic: Topic) {
        return await this.topicRepository.update(id, topic);
    }

    async findByName(name: string) : Promise<Topic|null> {
        //使用like语句返回名字中包含name的数据项
        return await this.topicRepository.findOne({where: {name: Like(`%${name}%`)}});
    }


    async findByNameMore(name: any) {
        return await this.topicRepository.find({where: {name: Like(`%${name}%`)}});
    }
}
