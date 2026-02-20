<script setup lang="ts">

import {Histogram} from "@element-plus/icons-vue";
import {onBeforeMount} from "vue";
import {useTopicStore} from "@/stores/topic.ts";
import type {Topic} from "@/utils/request/types.ts";
import {useQuestionStore} from "@/stores/qusetion.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const topicStore = useTopicStore()
const questionStore = useQuestionStore()

onBeforeMount(async() => {
  await topicStore.getTopics()
})

function onTopicBtnClick(topic: Topic) {
  topicStore.topic = topic
  questionStore.tab = "topic"
  router.push({name: 'select-answer-main'})
}

</script>

<template>
  <el-card class="w-full min-h-[220px]  my-3">
    <header class="head">
      <div class="flex justify-between items-center">
        <div class=" p-2 flex items-center leading-tight " >
          <el-icon size="20" color="red" >
            <Histogram ></Histogram>
          </el-icon>
          <div class="leading-tight ">大家都在搜</div>
        </div>
        <div class=" flex items-center text-sm text-gray-500" @click="topicStore.getTopics">
          刷新
          <el-icon size="20" class="ml-2">
            <Refresh></Refresh>
          </el-icon>
        </div>
      </div>
    </header>
    <main class="w-full mx-auto p-2">
      <div v-for="topic in topicStore.topics" @click="onTopicBtnClick(topic)"  class="hover:text-primary cursor-pointer topic-item my-1 overflow-ellipsis  overflow-hidden">
        {{topic.name}}<span class="text-gray-300 text-[15px] ml-1">{{topic.questionCount}}</span>
      </div>
    </main>
  </el-card>
</template>

<style scoped>
.topic-item:nth-child(-n+3)::before{
  color: red;
}

.topic-item::before{
  content: "·";
  margin-right: 5px;
  color: grey;
  font-size: 20px;
}


</style>