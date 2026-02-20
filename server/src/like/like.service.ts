import { Injectable } from '@nestjs/common';
import {LikeDto} from "./dto/like.dto";
import {InjectRepository} from "@nestjs/typeorm";

import { Repository} from "typeorm";
import {AnswerService} from "../answer/answer.service";
import {UsersService} from "../users/users.service";
import {Like} from "./entity/like.entity"
import {CancelLikeDto} from "./dto/cancel-like.dto";


@Injectable()
export class LikeService {
    constructor(
                @InjectRepository(Like) private readonly likeRepository: Repository<Like>,
                private readonly answerService: AnswerService,
                private readonly userService: UsersService
                ) {
    }
    async addLike(likeData:LikeDto) {

        const answer = await this.answerService.getAnswerById(likeData.answerId);
        const user = await this.userService.findOne(likeData.userId);
        if (!answer) {
            throw new Error('答案不存在');
        }
        const author = await this.userService.findOne(answer.authorId);
        if (!author) {
            throw new Error('作者不存在');
        }
        if (!user) {
            throw new Error('用户不存在');
        }
        if(likeData.isLike) {
            author.voteCount += 1;
            await this.userService.update(author.id,author)
            answer.voteUp +=1;
            await this.answerService.updateAnswer(answer.id,answer)
        }
        else {
            answer.voteDown +=1;
            await this.answerService.updateAnswer(answer.id,answer)
        }

        await this.answerService.updateAnswer(answer.id,answer)
        const like = new Like();
        like.answerId = likeData.answerId;
        like.userId = likeData.userId;
        like.isLike = likeData.isLike;
        return await this.likeRepository.save(like);

    }
    async getLikesByUserIdAndAnswerId(userId: string, answerId: string) {
        const like = await this.likeRepository.findOne({
            where: {
                answerId: answerId,
                userId: userId
            }
        });
        if (!like) {
            return {
                like: false,
                dislike: false
            }
        }
        return {
            like: like.isLike,
            dislike: !like.isLike
        }
    }
    async getLikesByAnswerId(answerId: string) {
        return await this.likeRepository.find({
            where: {
                answerId: answerId
            }
        });
    }

    async cancelLike(cancelLikeData:CancelLikeDto){
        const like = await this.likeRepository.findOne({
            where: cancelLikeData
        })
        if(!like) {
            return null;
        }
        const answer = await this.answerService.getAnswerById(cancelLikeData.answerId);
        if (!answer) {
            throw new Error('答案不存在');
        }
        const author = await this.userService.findOne(answer.authorId);
        if (!author) {
            throw new Error('作者不存在');
        }
        if(like.isLike) {
            author.voteCount -= 1;
            await this.userService.update(author.id,author)
            answer.voteUp -=1;
            await this.answerService.updateAnswer(answer.id,answer)
        }
        else {
            answer.voteDown -=1;
            await this.answerService.updateAnswer(answer.id,answer)
        }
        return await this.likeRepository.delete(cancelLikeData);

    }
}
