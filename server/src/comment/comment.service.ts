import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {AnswerService} from "../answer/answer.service";
import {UsersService} from "../users/users.service";
import {CreateCommentDto} from "./dto/create-commment.dto";
import {User} from "../users/entity/user.entity";
import {Answer} from "../answer/entity/answer.entity";
import {Comment} from "./entity/comment.entity";
@Injectable()
export class CommentService {

    constructor(@InjectRepository(Comment) private readonly commentRepository: Repository<Comment>,private readonly userService: UsersService,
               private readonly answerService: AnswerService
    ) {}
    async createComment(commentData: CreateCommentDto) {
        const user =await this.userService.findOne(commentData.userId);
        if(! user){
            throw new Error('用户不存在');
        }
        const answer:Answer | null =await this.answerService.getAnswerById(commentData.answerId);
        if(! answer){
            throw new Error('答案不存在');
        }
        answer.commentCount += 1;
        this.answerService.updateAnswer(answer.id,answer);
        const comment = new Comment();
        comment.userId = commentData.userId;
        comment.answerId = commentData.answerId;
        comment.content = commentData.content;
        return await this.commentRepository.save(commentData);
    }
    async getCommentsByAnswerId(answerId: string) {
        return await this.commentRepository.find({where: {answerId}});
    }
}
