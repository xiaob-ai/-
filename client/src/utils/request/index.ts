import axios from './http.ts'
import type {
    Answer,
    CancelLikeDto, CreateFollowQuestionDto, CreateFollowUserDto, FollowQuestion, FollowUser,
    LikeDto,
    Question,
    QuestionDto,
    Topic,
    TopicDto, UpdateUserDto,
    User
} from "@/utils/request/types.ts";
import type {Comment} from "@/utils/request/types.ts";
const userService = {
    async register(phone: string, password: string, name: string) :Promise<User | null> {
        return await axios.put('/users/register', {
            phone,
            password,
            name
        })
    },
    async login(phone: string, password: string):Promise<{token: string}| null>  {
         return await axios.post('/auth/login', {
            phone,
            password
        })

    },
    async getUserById(id: string): Promise<User | null> {
        return await axios.get(`/users/${id}`)
    },
    async getProfile() :Promise<User | null> {
        return await axios.get('/users/info')
    },
    async refresh():Promise<{token: string}| null> {
        return await axios.post('/auth/refresh')
    },
    async updateProfile(updateData: UpdateUserDto): Promise<User | null> {
        return await axios.post('/users/update', updateData)
    },
}

const topicService = {
    async create(topicData: TopicDto): Promise<Topic | null> {
        if(!topicData.name){
            throw new Error('未填写话题名称')
        }

        return await axios.put('/topic/create',topicData )
    },
    async random(): Promise<Topic[]|null> {
        return await axios.get('/topic/random')
    },
    async findOne(id: string): Promise<Topic | null> {
        return await axios.get(`/topic/${id}`)
    },
    async findByName(name: string): Promise<Topic | null> {
        return await axios.get(`/topic/search?name=${name}`)
    },
    async findMoreByName(name: string): Promise<Topic[] | null> {
        return await axios.get(`/topic/searchMore?name=${name}`)
    },

}

const questionService = {
    async createQuestion(questionData: QuestionDto): Promise<Question | null> {
        return await axios.put('/question/create', questionData)
    },
    async findOne(id: string): Promise<Question | null> {
        return await axios.get(`/question/${id}`)
    },
    async findTopicQuestions(topicId: string): Promise<Question[] | null> {
        const res: any[] | null = await axios.get(`/question/topic?topicId=${topicId}`)
        return res
    },
    async findLatestQuestions(): Promise<Question[] | null> {
         const res :any[] | null=  await axios.get(`/question/latest`)
        return res
    },

    async findQuestionsByName(name: string): Promise<Question[] | null> {
        const res: any[] | null = await axios.get(`/question/search?name=${name}`)
        return res
    },

    async findQuestionsRange(offset: number, limit: number): Promise<Question[] | null> {
        const res: any[] | null = await axios.get(`/question/recommend?offset=${offset}&limit=${limit}`)
        return res
    },
    async findQuestionById(id: string): Promise<Question | null> {
        return await axios.get(`/question/${id}`)
    },
    async findQuestionsByUserId(userId: string): Promise<Question[]> {
        return await axios.get(`/question/user?userId=${userId}`)
    },


}

const answerService = {
    async getBestAnswer(questionId: string): Promise<any | null> {
        return await axios.get(`/answer/best?questionId=${questionId}`)
    },
    async createAnswer(answerData: any): Promise<any | null> {
        return await axios.put('/answer/create', {answerData: answerData})
    },
    async getAnswersByQuestionId(questionId: string): Promise<Answer[] | null> {
        return await axios.get(`/answer/all?questionId=${questionId}`)
    },
    async getAnswersByUserId(userId: string): Promise<Answer[]> {
        return await axios.get(`/answer/user?userId=${userId}`)
    },
    async getAnswerById(id: string): Promise<Answer | null> {
        return await axios.get(`/answer/one?answerId=${id}`)
    },
}
const likeService = {
    async addLike(likeData: LikeDto): Promise<any | null> {
        return await axios.put('/like', {likeData: likeData})
    },
    async cancelLike(cancelLikeData: CancelLikeDto): Promise<any | null> {
        return await axios.delete('/like/cancel', {data: cancelLikeData})
    }
     ,
    async getUserIsLike( userId: string,answerId: string): Promise<{like: boolean,dislike :boolean} | null> {
        return await axios.get(`/like/isLike?answerId=${answerId}&userId=${userId}`)
    },
    async getLikesByAnswerId(answerId: string): Promise<any | null> {
        return await axios.get(`/like/getLikesByAnswerId?answerId=${answerId}`)
    },


}
const commentService = {
    async createComment(commentData: any): Promise<any | null> {
        return await axios.put('/comment/create', commentData)
    },
    async getCommentsByAnswerId(answerId: string): Promise<Comment[]> {
        return await axios.get(`/comment/answer?answerId=${answerId}`)
    }
}
const followService = {
    async followUser(createFollowUserDto: CreateFollowUserDto): Promise<any | null> {
        return await axios.put('/follow/followUser', {dto:createFollowUserDto})
    },
    async cancelFollowUser( createFollowUserDto: CreateFollowUserDto): Promise<any | null> {
        return await axios.delete('/follow/cancelFollowUser', {data: {dto:createFollowUserDto}})
    },
    async followQuestion(createFollowQuestionDto: CreateFollowQuestionDto): Promise<any | null> {
        return await axios.put('/follow/followQuestion', {dto:createFollowQuestionDto})
    },
    async cancelFollowQuestion(createFollowQuestionDto: CreateFollowQuestionDto): Promise<any | null> {
        return await axios.delete('/follow/cancelFollowQuestion', {data: {dto:createFollowQuestionDto}})
    },
    async getUserFollowerByUserId(userId: string): Promise<FollowUser[] > {
        return await axios.get(`/follow/user/following?userId=${userId}`)
    },
    async getFollowersByQuestionId(questionId: string): Promise<FollowQuestion[]> {
        return await axios.get(`/follow/question/following?questionId=${questionId}`)
    },
    async getFollowedUsersByUserId(userId: string): Promise<FollowUser[]> {
        return await axios.get(`/follow/user/follower?userId=${userId}`)
    },

}
export {userService,topicService,questionService,answerService,likeService,commentService,followService}