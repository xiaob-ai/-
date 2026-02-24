import {defineStore} from "pinia";
import {answerService, commentService, likeService} from "@/utils/request";
import type {AnswerDto, CancelLikeDto, LikeDto} from "@/utils/request/types.ts";
import {ref} from "vue";
import type {Comment, CommentDto} from "@/utils/request/types.ts";

export const useAnswerStore = defineStore(
    'answer',
    () => {
        const answerDraft = ref< string>('')
        async function likeAnswer(
            likeDate: LikeDto
        ){
             await likeService.addLike(likeDate)
        }
        async function cancelLike(
            cancelLikeData:CancelLikeDto
        ){
            await likeService.cancelLike(cancelLikeData)
        }
        async function isUserLike(
            userId: string, answerId: string
        ){
            const  res =  await likeService.getUserIsLike(userId, answerId)
            return res
        }


        async function createAnswer( authorId: string,questionId: string, content: string) {

            try {
                const answerDate:AnswerDto={
                    questionId: questionId,
                    authorId: authorId,
                    content: content
                }
                const res = await answerService.createAnswer(answerDate)
                if (res) {
                    return true
                }
            }catch (e) {
                return false
            }

        }
        // 获取最佳回答
        async function getBestAnswer(questionId: string){

             return await answerService.getBestAnswer(questionId)
        }
        // 获取评论
        async function getCommentsByAnswerId(answerId: string): Promise<Comment[]>{
            return await commentService.getCommentsByAnswerId(answerId)
        }
        // 创建评论
        async function createComment(commentData: CommentDto) {
            return await commentService.createComment(commentData)
        }
        // 获取问题所有回答
        async function getAnswersByQuestionId(questionId: string) {
            return await answerService.getAnswersByQuestionId(questionId)
        }
        // 获取点赞记录
        async function getLikesRecordByAnswerId(answerId: string) {
            return await likeService.getLikesByAnswerId(answerId)
        }
        // 获取用户所有回答
        async function getAnswersByUserId(userId: string) {
            return await answerService.getAnswersByUserId(userId)
        }
        async function getAnswerById(answerId: string) {
            return await answerService.getAnswerById(answerId)
        }

        return {
            getAnswerById,
            getAnswersByQuestionId,
            getBestAnswer,
            createAnswer,
            answerDraft,
            likeAnswer,
            cancelLike,
            isUserLike,
            getCommentsByAnswerId,
            createComment,
            getLikesRecordByAnswerId,
            getAnswersByUserId
        }
    }
)