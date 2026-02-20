<script setup lang="ts">

import { useRouter } from 'vue-router'
import {useQuestionStore} from "@/stores/qusetion.ts";
import type {QuestionWithTopics} from "@/types";
import {onMounted} from "vue";


const questionStore = useQuestionStore()

/* 数据 */
const router = useRouter()

onMounted(() => {
  questionStore.getQuestions()
})






/* 跳转写回答 */
function goAnswer(question: QuestionWithTopics) {
  questionStore.question = question
  router.push({ name: 'write-answer' })
}
</script>

<template>
  <main class="lg:col-span-9">
    <!-- 骨架屏 -->
    <template v-if="questionStore.isLoding">
      <div
          v-for="i in 6"
          :key="i"
          class="mb-4 animate-pulse rounded-xl bg-white p-5 shadow-sm"
      >
        <div class="h-5 w-3/4 rounded bg-gray-200"></div>
        <div class="mt-3 h-4 w-1/3 rounded bg-gray-200"></div>
      </div>
    </template>

    <!-- 空状态 -->
    <div
        v-if="!questionStore.isLoding && questionStore.QuestionList.length === 0"
        class="flex flex-col items-center rounded-xl bg-white py-12 shadow-sm"
    >
      <img
          class="h-32 w-32"
          src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=empty"
          alt="empty"
      />
      <span class="mt-4 text-gray-500">暂无符合条件的问题</span>
    </div>

    <!-- 问题卡片 -->
    <div
        v-for="q in questionStore.QuestionList"
        :key="q.id"
        @click="goAnswer(q)"
        class="mb-4 cursor-pointer rounded-xl bg-white p-5 shadow-sm hover:shadow"
    >
      <h3 class="text-base font-medium text-gray-900">
        {{ q.title }}
      </h3>
      <div class="mt-2 flex flex-wrap gap-2">
              <div class="text-sm  text-gray-600">{{q.detail}}</div>
              <span
                  v-for="t in q.topics"
                  :key="t.id"
                  class="rounded bg-gray-100 px-2 py-0.5 text-xs text-gray-600"
              >
                # {{ t.name }}
              </span>
      </div>
      <div class="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>{{ q.answerCount }} 个回答</span>
        <span>{{ q.viewCount }} 次浏览</span>
      </div>
    </div>
  </main>
</template>

<style scoped>

</style>