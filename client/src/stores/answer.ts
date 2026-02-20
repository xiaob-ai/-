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

        async function getBestAnswer(questionId: string){

             return await answerService.getBestAnswer(questionId)
        }
        async function getCommentsByAnswerId(answerId: string): Promise<Comment[]>{
            return await commentService.getCommentsByAnswerId(answerId)
        }
        async function createComment(commentData: CommentDto) {
            return await commentService.createComment(commentData)
        }
        async function getAnswersByQuestionId(questionId: string) {
            return await answerService.getAnswersByQuestionId(questionId)
        }
        async function getLikesRecordByAnswerId(answerId: string) {
            return await likeService.getLikesByAnswerId(answerId)
        }

        return {
            getAnswersByQuestionId,
            getBestAnswer,
            createAnswer,
            answerDraft,
            likeAnswer,
            cancelLike,
            isUserLike,
            getCommentsByAnswerId,
            createComment,
            getLikesRecordByAnswerId
        }
    }
)