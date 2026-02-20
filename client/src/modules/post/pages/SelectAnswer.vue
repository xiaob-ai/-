<!-- PickQuestion.vue -->
<template>
  <div class="min-h-screen  bg-gray-50">
    <div class="mx-auto  max-w-6xl px-4 py-6">
      <!-- 顶部搜索 -->
      <div class="mb-5 flex gap-3">
        <input
            v-model="keyword"
            placeholder="搜索你感兴趣的话题..."

            class="w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />
        <button
            @click="loadList"
            class="rounded-lg w-20 bg-blue-600 px-1 py-2 text-sm  text-white hover:bg-blue-700"

        >
          搜索
        </button>
      </div>
      <router-view>

      </router-view>

    </div>
  </div>
</template>

<script setup lang="ts">
import {useTopicStore} from "@/stores/topic.ts";
import {useQuestionStore} from "@/stores/qusetion.ts";
import { ref} from "vue";
import {ElMessage} from "element-plus";

const questionStore = useQuestionStore()
const topicStore = useTopicStore()
const keyword = ref('')

const loadList = async () => {
  if(questionStore.tab === 'topic') {
    await topicStore.getTopicByName(keyword.value)
    if(topicStore.topic) await questionStore.getTopicQuestions(topicStore.topic.id)
    else{
      ElMessage.error('未匹配到话题')
    }
  }
  if(questionStore.tab === 'new'){
      await questionStore.searchQuestions(keyword.value)
  }

}

</script>