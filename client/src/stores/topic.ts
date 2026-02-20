import {defineStore} from "pinia";
import type {Topic, TopicDto} from "@/utils/request/types.ts";
import { ref} from "vue";
import {topicService} from "@/utils/request/index.ts";
import {ElMessage} from "element-plus";


export const useTopicStore = defineStore(
    'topic',
    () => {
        /* 状态 */
        // top十话题列表
        let topics = ref<Topic[]>([])

        //选择问题模块当前话题
        let topic = ref<Topic | null>(null)



        /* 获取 */
        async function getTopics() {
            let res = await topicService.random()

            if(res)topics.value =  res
            else{
                ElMessage.error('获取话题失败!')
            }
        }

        /* 获取 */
        async function getTopic(id: string) {

            let res = await topicService.findOne(id)
            if( res){
                return res
            }
        }
        async function getTopicByName(name: string) {
            let res = await topicService.findByName(name)
            if( res){
                topic.value = res
            }
            else{
                return
            }
        }

        async function getTopicsByName(name: string): Promise<Topic[]> {
            if(name.length === 0)return [] as Topic[]
            let res = await topicService.findMoreByName(name)
            if( res){
                return res
            }
            else{
                return  [] as Topic[]
            }
        }


        async function createTopic(topic: TopicDto) {
            let res = await topicService.create(topic)
            if(res){
                ElMessage.success('话题创建成功!')
            }

            return res
        }
        return {
            topics,
            getTopics,
            getTopic,
            createTopic,
             topic,
            getTopicByName,

            getTopicsByName,
        }
    }


)