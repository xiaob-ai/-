<script setup lang="ts">

import {UserFilled} from "@element-plus/icons-vue";
import {useQuestionStore} from "@/stores/qusetion.ts";
import {useRouter} from "vue-router";

const router = useRouter()
const questionStore = useQuestionStore()

function onGoCreateQuestionBtn(){
  questionStore.tab = "new"
  router.push({name: 'select-answer-main'})
}

</script>

<template>
  <el-card class="w-full  my-3 ">
    <header class="flex head justify-between items-center">
      <div class=" p-2 flex items-center leading-tight " >
        <el-icon size="20" >
          <user-filled ></user-filled>
        </el-icon>
        <div class="leading-tight ">创作中心</div>
      </div>
      <div class="text-sm text-gray-500">
        草稿箱
      </div>
    </header>
    <main class="bg-gray-100 p-2 items-center head h-20 mt-2 flex">
      <div>
        <div class="text-xl mb-2 text-b">
          开启你的知乎创作之旅
        </div>
        <div class="text-gray-500 text-sm">
          快来成为知乎创作者吧~
        </div>
      </div>
      <el-icon size="60" class="ml-2"><EditPen /></el-icon>


    </main>
    <footer class="p-2 mt-2 border-primary text-center border head text-primary rounded" @click="onGoCreateQuestionBtn">
      +开始创作
    </footer>
  </el-card>
</template>

<style scoped>

</style>