
//用户
interface User {
    id: string // UUID
    username: string // 唯一
    email?: string
    phone: string // 唯一
    passwordHash: string
    avatar: string // URL
    headline?: string // 一句话介绍
    bio?: string // 个人简介
    location?: string
    business?: string // 所在行业
    school?: string
    major?: string
    followerCount: number // 冗余，定时刷新
    followingCount: number
    voteCount: number // 获得赞同数
    thankCount: number // 获得感谢数
    isEmailVerified: boolean
    role: 'user' | 'admin' | 'super'
    createdAt: Date
    updatedAt: Date
}

//话题
interface Topic {
    id: string
    name: string // 唯一
    description?: string
    questionCount: number // 冗余
    followerCount: number
    parentId?: string // 支持父子话题
    createdAt: Date
}
interface TopicDto{
    name: string
    description?: string
}
//问题
interface Question {
    id: string
    title: string
    detail?: string // 问题补充，富文本
    authorId: string
    topicIds: string[] // 关联话题
    viewCount: number
    answerCount: number
    followerCount: number
    commentCount: number
    lastActiveAt: Date // 最后回答/评论时间
    createdAt: Date
    updatedAt: Date
    status: 'open' | 'closed' | 'deleted'
}

interface QuestionDto{
    title: string
    detail?: string
    topicIds: string[]
    authorId: string
}

//回答
interface Answer {
    id: string
    questionId: string
    authorId: string
    content: string // 富文本
    voteUp: number
    voteDown: number
    commentCount: number
    isCollapsed: boolean // 被折叠
    questionTitle: string
    createdAt: Date
    updatedAt: Date
    status: 'normal' | 'deleted'
}
interface AnswerDto{
    questionId: string
    authorId: string
    content: string
}

//评论
interface Comment {
    id: string
    userId: string
    answerId: string
    content: string // 纯文本 500 字
    createdAt: Date
}

interface CommentDto{
    userId: string
    answerId: string
    content: string
}

//收藏夹
interface Collection {
    id: string
    name: string
    description?: string
    authorId: string
    isPublic: boolean
    itemCount: number // 冗余
    createdAt: Date
}

//收藏项
interface CollectionItem {
    id: string
    collectionId: string
    targetType: 'answer' | 'question'
    targetId: string
    addedAt: Date
}

//草稿
type DraftType = 'question' | 'answer'

interface Draft {
    id: string
    type: DraftType
    targetId?: string // 回答时存 questionId
    authorId: string
    title?: string // 问题草稿用
    content: string // 富文本
    topicIds?: string[] // 问题草稿
    createdAt: Date
    updatedAt: Date
}

interface BaseResponse<T = any> {
    code: number
    msg: string
    data: T
}

interface LoginResponseData  {
    token: string
}

type Method = 'get' | 'post' | 'put' | 'delete'
interface LikeDto{
    userId: string;
    answerId: string;
    isLike: boolean;
}
interface CancelLikeDto {
    userId: string;
    answerId: string;
}

interface Like {
    id: string;
    answerId: string;
    userId: string;
    isLike: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface CreateFollowQuestionDto {
    questionId: string;
    userId: string;
}
export interface CreateFollowUserDto {
    followerId: string;
    userId: string;
}
export interface FollowQuestion {
    id: string;
    questionId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface FollowUser {
    id: string;
    followUserId: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export type {
    Like,
    LikeDto,
    User,
    Topic,
    Question,
    Answer,
    Comment,
    CancelLikeDto,
    CommentDto,

    Collection,
    CollectionItem,
    Draft,
    BaseResponse,
     Method,
    LoginResponseData,
    TopicDto,
    QuestionDto,
    AnswerDto
}

