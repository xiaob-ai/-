import { Injectable } from '@nestjs/common';
import {CreateQuestionDto} from "./dto/create-question.dto";
import {Question} from "./entity/question.entity";
import {Raw, Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {TopicService} from "../topic/topic.service";


@Injectable()
export class QuestionService {
    constructor(@InjectRepository(Question) private readonly questionRepository: Repository<Question>,private readonly topicService: TopicService) {
    }
    async createQuestion(questionData: CreateQuestionDto) {
        const question = new Question();
        question.title = questionData.title;
        question.detail = questionData.detail;
        question.topicIds = questionData.topicIds || [];
        question.authorId = questionData.authorId;
        question.status = 'open';
        if(question.topicIds.length > 0){
            question.topicIds.map(async (topicId)=>{
                const topic = await this.topicService.findOne(topicId);
                if( topic){
                    topic.questionCount += 1;
                    await this.topicService.update(topicId,topic)
                }
            })
        return await this.questionRepository.save(question);
        }
    }
    async findOne(id: string) {
        return await this.questionRepository.findOne({where: {id}});
    }
    async update(id: string, question: Question) {
        return await this.questionRepository.update(id, question);
    }
    // 获取话题下的问题
    async findTopicQuestions(topicId: string) {
        const questions = await this.questionRepository.find();
        return questions.filter(question => question.topicIds.includes(topicId));
    }

    //获取关注数排前十的问题
    async findFollowedQuestions(userId: string) {
        return await this.questionRepository.find({
            order: {
                followerCount: 'DESC'
            },
            take: 10
        });
    }


    //根据名字查询问题
    async  findByName(name: string): Promise<Question[]> {
        return await this.questionRepository.find({
            where: {
                title: Raw(alias => `${alias} LIKE '%${name}%'`)
            }
        });
    }



    //获取最新十条问题
    async findLatestQuestions() {
        return await this.questionRepository.find({
            order: {
                createdAt: 'DESC'
            },
            take: 10
        });
    }

    //更新问题
    async updateQuestion(id: string, question: Question) {
        return await this.questionRepository.update(id, question);
    }

    //获取特定范围的问题
    async findByRange(start: number,count: number) {

        const questionList = await this.questionRepository.find({
            order: {
                createdAt: 'DESC'
            },
            skip: start,
            take: count
        });
        return questionList.filter(question => question.status === 'open' && question.answerCount > 0);
    }
}
