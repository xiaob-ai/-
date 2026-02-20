<template>

    <div class="w-full relative" >
      <LikeRecord  v-if="appStore.isShowCover"></LikeRecord>
      <div class="w-full relative" :style="{top:componentTopStyle}" >
        <header class="w-full  shadow h-[200px] bg-white p-5 flex justify-center">
          <div class="w-2/5 h-full mr-10">
            <div class="mb-2 flex">
              <div class=" text-sm leading-tight   rounded-full mx-1 p-1 px-2 bg-blue-200 text-primary" v-for="item in questionWithTopics?.topics" :key="item.id">
                {{item.name}}
              </div>
            </div>
            <div class="mb-2 font-bold text-2xl">{{questionWithTopics?.title || '问题错误'}}</div>
            <div class="h-12  overflow-hidden text-ellipsis">{{questionWithTopics?.detail || '暂无描述'}}</div>
            <div class="flex mt-2">
              <div class="hover:bg-blue-400 text-white p-2 mr-2 rounded cursor-pointer " :class="{'bg-blue-200':isFollowing,'bg-primary':!isFollowing}" @click="handleFollowBtn" >{{isFollowing?'取消关注':'关注问题'}}</div>
              <div class="bg-white border-primary border flex items-center hover:bg-blue-100 text-primary p-2 mr-2 rounded" @click="questionStore.question=questionWithTopics;$router.push({name:'write-answer'})"><el-icon><EditPen /></el-icon>写回答</div>
              <div class=" hover:bg-gray-200 text-gray-500  flex items-center border border-gray-500 p-2 mr-2 rounded"><el-icon><Plus /></el-icon>邀请回答</div>
            </div>
          </div>
          <div class=" h-20 items-center flex">
            <div class="px-4 border-r border-gray-500 hover:text-black  py-2">
              <div class="text-sm hover:text-black  text-gray-500 ">关注者</div>
              <div class="text-2xl text-center font-bold">{{followingCount || 0}}</div>
            </div>
            <div class="px-4   py-2">
              <div class="text-sm hover:text-black text-gray-500 ">被浏览</div>
              <div class="text-2xl text-center font-bold">{{questionWithTopics?.viewCount || 0}}</div>
            </div>
          </div>
        </header>
        <main class=" w-1/2  mx-auto mt-2 shadow bg-white ">
          <div class="border-b h-16 p-2 flex justify-between items-center">
            <div class="font-bold">{{answerList.length}}个回答</div>
            <AnswerSortSelector @selectChange="refreshSort"></AnswerSortSelector>
          </div>
          <div>
            <div v-for="item in answerList" :key="item.id">
              <AnswerCard :question="questionWithTopics!" :answer="item"></AnswerCard>
            </div>
          </div>
        </main>
      </div>


    </div>



</template>
<script setup lang="ts">
import {computed, onBeforeMount,  ref} from "vue";
import {useRouter} from "vue-router";
import type {Answer} from "@/utils/request/types.ts";

import {useQuestionStore} from "@/stores/qusetion.ts"
import {useTopicStore} from "@/stores/topic.ts";
import {useAnswerStore} from "@/stores/answer.ts";
import AnswerSortSelector from "@/modules/Detail/components/AnswerSortSelector.vue";
import AnswerCard from "@/modules/Detail/components/AnswerCard.vue";
import LikeRecord from "@/modules/Detail/components/LikeRecord.vue";
import {useAppStore} from "@/stores/app.ts";
import type {QuestionWithTopics} from "@/types";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore()
const appStore = useAppStore();
const componentTopStyle =computed(()=>{
  return appStore.isShowCover ? -appStore.scrollY + 'px' : '0px'
})
// 是否关注
const isFollowing = ref(false)
const followingCount = ref(0)
const handleFollowBtn = async function(){
  if(isFollowing.value){
    await userStore.cancelFollowQuestion({questionId:questionWithTopics.value!.id,userId:userStore.profile!.id})
    isFollowing.value = false
    followingCount.value -= 1
  }else{
    await userStore.followQuestion({questionId:questionWithTopics.value!.id,userId:userStore.profile!.id})
    isFollowing.value = true
    followingCount.value += 1
  }
}


const answerStore = useAnswerStore()
const topicStore = useTopicStore()
const questionStore = useQuestionStore()
const questionWithTopics= ref<QuestionWithTopics|null>(null)
const answerList = ref<Answer[]>([])

const router = useRouter()
onBeforeMount(async()=>{
  const question =await questionStore.getQuestionById(router.currentRoute.value.params.questionId as string)
  if(question){
    questionWithTopics.value = {...question,topics:[]}
    const res = await questionStore.getFollowersByQuestionId(questionWithTopics.value!.id)
    isFollowing.value = res.some(item=>item.userId === userStore.profile!.id)
    followingCount.value = res.length
  }
  if(question){
    for (const topicId of question.topicIds) {
      const res = await topicStore.getTopic(topicId)
      if(res){
        questionWithTopics.value!.topics.push(res)

      }
    }
    const res=  await answerStore.getAnswersByQuestionId(question.id)
    if(res){
      answerList.value = res
    }
    //回答按点赞排序
    answerList.value.sort((a,b)=>{
      return b.voteUp-a.voteUp+b.voteDown-a.voteDown
    })
    question.viewCount+=1

  }

})

const refreshSort = (isDefault:boolean)=>{
  if(isDefault){
    answerList.value.sort((a,b)=>{
      return b.voteUp-a.voteUp+b.voteDown-a.voteDown
    })
  }else{
    answerList.value.sort((a,b)=>{
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()
    })
  }
}
</script>
<style scoped>
</style>