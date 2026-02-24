<script setup lang="ts">

import AnswerSortSelector from "@/modules/Detail/components/AnswerSortSelector.vue";
import {onBeforeMount, type PropType, reactive} from "vue";
import {useAnswerStore} from "@/stores/answer.ts";
import type {Answer, User} from '@/utils/request/types.ts'
import UserAnswerCard from "@/modules/user/components/Answer/components/UserAnswerCard.vue";


const answerStore = useAnswerStore();
const {user} = defineProps({
  user: Object as PropType<User>
})
// 用户回答列表
const answerList= reactive<Answer[] >([]);
onBeforeMount(async() => {
  if(user){

    const res = await answerStore.getAnswersByUserId(user.id)
    res.forEach(answer=>{
      answerList.push(answer)
    })


  }
});
const refreshSort = (isDefault:boolean)=>{
  if(isDefault){
    answerList.sort((a,b)=>{
      return b.voteUp-a.voteUp+b.voteDown-a.voteDown
    })
  }else{
    answerList.sort((a,b)=>{
      return new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()
    })
  }
}
</script>

<template>
  <div class="p-2">
    <header class="flex w-full p-2 justify-between relative border-b items-center" >
      <div class="font-bold">他的回答</div>
      <AnswerSortSelector class="absolute right-0" @sortChange="refreshSort"></AnswerSortSelector>
    </header>
    <main >
        <UserAnswerCard v-for="answer of answerList" :key="answer.id" class="border-b" :answer="answer" :user="user"></UserAnswerCard>
    </main>
  </div>
</template>

<style scoped>


</style>