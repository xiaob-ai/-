import type {Question, Topic} from "@/utils/request/types.ts";

export enum CommentPermission {
    public ,
    onlyChoose ,
    onlyLikeMe ,
    disable
}
export enum CreateType{
    createQuestion,
    createAnswer
}

export interface QuestionWithTopics extends Question{
    topics: Topic[]
}