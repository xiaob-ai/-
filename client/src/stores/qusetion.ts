import {defineStore} from "pinia";
import { ref, watch} from "vue";
import type {Question, QuestionDto, Topic} from "@/utils/request/types.ts";
import {followService, questionService, topicService} from "@/utils/request";
import {ElMessage} from "element-plus";
import type {QuestionWithTopics} from "@/types";
import {useTopicStore} from "@/stores/topic.ts";

const topicStore = useTopicStore()

export const useQuestionStore = defineStore(
    'question',
    () => {
        const isLoding = ref(false)

        //当前问题列表
        const QuestionList = ref<QuestionWithTopics[]>([])

        //当前准备回答的问题
        const question = ref<QuestionWithTopics | null>(null)

        //选择问题模块左侧功能切换
        const tab = ref<"new"|"topic" >("new")

        //获取话题下的问题
        async function getTopicQuestions(topicId: string){
            const res = await questionService.findTopicQuestions(topicId);
            if(res&& res.length > 0){
                QuestionList.value =await addTopicToQuestions(res)
            }
            else{
                QuestionList.value =  []
            }
        }
        async function getQuestionById(id: string){
            return  await questionService.findOne(id);

        }

        //获取推荐问题
        async function getRecommendQuestions(offset: number,limit: number){
            return await questionService.findQuestionsRange(offset,limit);
        }


        //创建问题
        async function createQuestion(questionData: QuestionDto){
            const res = await questionService.createQuestion(questionData);
            if(res){
                ElMessage.success('创建成功');
            };
        }
        async function getQuestions(){
            if(tab.value === "topic"){
                isLoding.value = true
                if(!topicStore.topic){
                    ElMessage.error('请选择话题');
                    QuestionList.value = []
                    isLoding.value = false
                    return
                }
                await getTopicQuestions(topicStore.topic.id)
                isLoding.value = false
                QuestionList.value = QuestionList.value
            }
            if(tab.value === "new"){
                isLoding.value = true
                await getLatestQuestions()
                isLoding.value = false
                QuestionList.value = QuestionList.value
            }
        }

        watch(tab, getQuestions)

        async function getLatestQuestions(){

            const res = await questionService.findLatestQuestions();

            if(res && res.length > 0){
                QuestionList.value =await addTopicToQuestions(res)
            }
            else{
                QuestionList.value = []
            }

        }

        //根据名字查找问题
        async function searchQuestions(name: string){
            const res = await questionService.findQuestionsByName(name);
            if(res){
                QuestionList.value = await addTopicToQuestions(res)
            }
            else{
                QuestionList.value = []
            }
        }
        //给问题列表添加具体话题
        async function addTopicToQuestions(questions: Question[]):Promise<QuestionWithTopics[]> {
            questions.map(question=>{
                const questionWithTopics: QuestionWithTopics = {...question, topics: [] as Topic[]};
                if(question.topicIds.length === 0){
                    return questionWithTopics
                }
                question.topicIds.forEach(async topicId=>{
                    const res = await topicService.findOne(topicId);
                    if( res){questionWithTopics.topics.push(res)}
                })
                return questionWithTopics
            })
            return questions as QuestionWithTopics[]
        }
        async function getFollowersByQuestionId(questionId: string){
            return await followService.getFollowersByQuestionId(questionId)
        }
        return {
            isLoding,
            tab,
            getFollowersByQuestionId,
            createQuestion,
            QuestionList,
            getTopicQuestions,
            getLatestQuestions,
            question,
            getQuestions,
            searchQuestions,
            getRecommendQuestions,
            getQuestionById

        }
    }
)