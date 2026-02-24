<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useQuestionStore} from "@/stores/qusetion.ts";
import type {Question, User} from "@/utils/request/types.ts";
import QuestionCard from "@/modules/user/components/Question/components/QuestionCard.vue";

const questionStore = useQuestionStore()
const questionList = ref<Question[]>([])
const props=defineProps<{
  user:User
}>()
onMounted(async()=>{
  if(props.user.id){

    const res =await questionStore.getQuestionsByUserId(props.user.id  )
    res.forEach(question=>{
      questionList.value.push(question)
    })
  }
})


</script>

<template>
  <div class="p-2">
    <header class="flex w-full p-2 justify-between relative border-b items-center" >
      <div class="font-bold">他的提问</div>
    </header>
    <main >
      <QuestionCard v-for="question in questionList" :question="question"></QuestionCard>
    </main>
  </div>
</template>

<style scoped>

</style>