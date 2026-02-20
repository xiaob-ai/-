import { Injectable } from '@nestjs/common';
import {CreateFollowQuestionDto} from "./dto/create-follow-question.dto";
import {FollowQuestion} from "./entity/followQuestion.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {FollowUser} from "./entity/followUser.entity";
import {QuestionService} from "../question/question.service";
import {UsersService} from "../users/users.service";
import {CreateFollowUserDto} from "./dto/create-follow-user.dto";

@Injectable()
export class FollowService {
    constructor(@InjectRepository(FollowQuestion) private readonly followQuestionRepository: Repository<FollowQuestion>,
                @InjectRepository(FollowUser) private readonly followUserRepository: Repository<FollowUser>,
                private readonly questionService:QuestionService,
                private readonly usersService:UsersService
                ) {
    }
    async followQuestion(createFollowQuestionDto:CreateFollowQuestionDto) {
        const {questionId,userId} = createFollowQuestionDto;
        const question =await this.questionService.findOne(questionId);
        if(!question){
            throw new Error('问题不存在');
        }
        const user =await this.usersService.findOne(userId);
        if(!user){
            throw new Error('用户不存在');
        }
        const followQuestion = await this.followQuestionRepository.findOne({
            where:{
                questionId:questionId,
                userId:userId
            }
        });
        if(followQuestion){
            throw new Error('已经关注了');
        }
        const res= await this.followQuestionRepository.save({
            questionId:questionId,
            userId:userId
        });
        if(res){

            question.followerCount++;
            await this.usersService.update(userId,user);
            await this.questionService.update(questionId,question);
            return res;
        }
    }
    async followUser(createFollowUserDto:CreateFollowUserDto) {
        const {followerId,userId} = createFollowUserDto;
        const followUser =await this.usersService.findOne(followerId);
        if(followerId === userId){
            throw new Error('不能关注自己');
        }
        if(!followUser){
            throw new Error('用户不存在');
        }
        const user =await this.usersService.findOne(userId);
        if(!user){
            throw new Error('用户不存在');
        }
        const followUserRecord =await this.followUserRepository.findOne({where:{followUserId:followerId,userId:userId}});
        if(followUserRecord){
            throw new Error('已经关注了');
        }
        if(!followUser){
            throw new Error('用户不存在');
        }
        const res= await this.followUserRepository.save({
            followUserId:followerId,
            userId:userId
        });
        if(res){
            user.followingCount++;
            followUser.followerCount++;
            await this.usersService.update(followerId,followUser);
            await this.usersService.update(userId,user);
            return res;
        }
    }
    async cancelFollowQuestion(createFollowQuestionDto:CreateFollowQuestionDto) {
        const {questionId,userId} = createFollowQuestionDto;
        const question =await this.questionService.findOne(questionId);

        if(!question){
            throw new Error('问题不存在');
        }
        const user =await this.usersService.findOne(userId);
        if(!user){
            throw new Error('用户不存在');
        }

        const res= await this.followQuestionRepository.delete({
            questionId:questionId,
            userId:userId
        });
        if(res){
            question.followerCount--;
            await this.usersService.update(userId,user);
            await this.questionService.update(questionId,question);
            return res;
        }
    }
    async cancelFollowUser(createFollowUserDto:CreateFollowUserDto) {
        const {followerId,userId} = createFollowUserDto;
        const followUser =await this.usersService.findOne(followerId);
        if(!followUser){
            throw new Error('用户不存在');
        }
        const user =await this.usersService.findOne(userId);
        if(!user){
            throw new Error('用户不存在');
        }
        const res= await this.followUserRepository.delete({
            followUserId:followerId ,
            userId:userId
        });
        if(res){
            user.followingCount--;
            followUser.followerCount--;
            await this.usersService.update(followerId,followUser);
            await this.usersService.update(userId,user);
            return res;
        }
    }
    async findFollowQuestions(questionId: string) {
        const res= await this.followQuestionRepository.find({
            where:{
                questionId:questionId
            }
        });
        if(res){
            return res;
        }
    }
    async findFollowUsers(userId: string) {
        const res= await this.followUserRepository.find({
            where:{
                userId:userId
            }
        });
        if(res){
            return res;
        }
    }

}
