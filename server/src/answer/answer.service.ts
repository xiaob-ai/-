import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Answer} from "./entity/answer.entity";
import {Raw, Repository} from "typeorm";
import {CreateAnswerDto} from "./dto/create-answer.dto";
import {QuestionService} from "../question/question.service";
import {UsersService} from "../users/users.service";

@Injectable()
export class AnswerService {
    constructor(@InjectRepository(Answer) private readonly answerRepository: Repository<Answer>,private readonly questionService: QuestionService,private readonly userService: UsersService) {
    }

    async createAnswer(answerData: CreateAnswerDto) {
        const question = await this.questionService.findOne(answerData.questionId)
        if (!question) {

            throw new Error('问题不存在');

        }
        question.answerCount += 1;
        await this.questionService.updateQuestion(question.id,question)
        const author = await this.userService.findOne(answerData.authorId)
        if (!author) {
            throw new Error('用户不存在');
        }

        const answer = new Answer();
        answer.authorId = answerData.authorId;
        answer.content = answerData.content;
        answer.questionId = answerData.questionId;
        answer.questionTitle = question.title;
        return await this.answerRepository.save(answer);
    }

    async getAnswersByQuestionId(questionId: string) {
        const question = await this.questionService.findOne(questionId)
        if (!question) {
            throw new Error('问题不存在');
        }
        question.viewCount += 1;
        this.questionService.updateQuestion(question.id,question)
        return  await this.answerRepository.find({
            where: {
                questionId: questionId
            }
        });
    }

    async getAnswerById(answerId: string) {
        return await this.answerRepository.findOne({
            where: {
                id: answerId
            }
        });
    }
    async getBestAnswerByQuestionId(questionId: string) {
        return await this.answerRepository.findOne({
            where: {
                questionId: questionId,

            },
            //根据点赞减去反对来排序
            order: {

                voteUp: 'DESC',
                voteDown: 'ASC'
            }
        });
    }

    async updateAnswer(id: string, answer: Answer) {
        return await this.answerRepository.update(id,answer);
    }

}
