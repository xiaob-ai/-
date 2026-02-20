<template>
  <el-card class="w-full min-h-screen my-3">
    <div class="qa-container" ref="rootRef">
      <div v-for="item in qaList" :key="item.id" >
        <QuestionItem :question="item" />
      </div>

      <!-- 底部提示 -->
      <p v-if="loading" class="tips">加载中…</p>
      <p v-if="finished" class="tips">没有更多了</p>
    </div>
  </el-card>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

import { debounce } from '@/utils/index.ts'   // 上一条回答里的防抖函数
import {useQuestionStore} from "@/stores/qusetion.ts";
import {ElMessage} from "element-plus";
import type {Question} from "@/utils/request/types.ts";
import QuestionItem from "@/modules/common/components/QuestionItem.vue";

const questionStore = useQuestionStore()
/* ---------- 状态 ---------- */
const qaList = ref<Question[]>([])
const qaListMax = 30
const loading = ref(false)

const offset = ref(0)
const limit = ref(10)
const rootRef = ref<HTMLElement>()
const finished = ref(false)

/* ---------- 数据获取 ---------- */
async function fetchPage() {
  if (loading.value|| finished.value) return
  loading.value = true

    // 这里换成你的真实接口；下面用 mocky 做演示
    const res= await questionStore.getRecommendQuestions(offset.value, limit.value)

    if (res && res.length>0) {
      if(qaList.value.length > qaListMax){
        // 超出最大值清除最前面的10个
        qaList.value = qaList.value.slice(10,30)
      }
      res.forEach(question=>{
        qaList.value.push(question)
      })
      offset.value += qaList.value.length
      loading.value = false

    }
    else {
      ElMessage.success('没有更多了')
      finished.value = true
      loading.value = false
    }

}

/* ---------- 滚动触底检测 ---------- */
const scrollHandler = debounce(() => {
  const el = rootRef.value
  if (!el) return
  const nearBottom =
      el.scrollTop + el.clientHeight >= el.scrollHeight - 40
  if (nearBottom) fetchPage()
}, 200)

onMounted(async () => {
  await fetchPage() // 首屏
  rootRef.value?.addEventListener('scroll', scrollHandler)
})
</script>
