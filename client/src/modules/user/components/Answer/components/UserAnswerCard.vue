<script setup lang="ts">
import {onBeforeMount, onMounted, type PropType, ref} from "vue";
import type {Answer, Question, User} from "@/utils/request/types.ts";
import {useQuestionStore} from "@/stores/qusetion.ts";
import AnswerContent from "@/modules/user/components/Answer/components/AnswerContent.vue";

const questionStore = useQuestionStore();
const {answer}=defineProps({
  answer: Object as PropType<Answer>,
  user: Object as PropType<User>
})
const question=ref<Question|null>(null)
onBeforeMount(async()=>{

  if(answer){
    question.value = await questionStore.getQuestionById(answer.questionId)
  }
})

</script>

<template>
<div class="p-2 cursor-pointer">
  <header class="text-xl font-bold hover:text-primary mb-2" @click="$router.push(`/detail/${question?.id}?answerId=${answer?.id}`)">
    {{question?.title}}
  </header>
  <div class="flex mb-2 items-center">
    <img :src="user?.avatar" class="w-8 h-8 mr-2">
    <div>
      <div class="text-md font-bold">{{user?.username}}</div>
      <div class="text-gray-500 text-[8px]">{{user?.bio}}</div>
    </div>

  </div>
  <main >
    <AnswerContent :answerId="answer?.id||''" ></AnswerContent>
  </main>
</div>
</template>

<style scoped>

</style>