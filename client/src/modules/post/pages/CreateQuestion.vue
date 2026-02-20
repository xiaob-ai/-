<!-- ZhihuAsk.vue -->
<template>
  <div class="w-1/2  mx-auto mt-6 rounded-xl bg-white shadow-sm">
    <!-- 顶部 -->
    <div class="px-6 pt-5 pb-4 border-b border-gray-100">
      <h2 class="text-xl font-semibold text-primary">提出问题</h2>
      <p class="text-sm text-gray-500 mt-1">描述越清晰，越容易得到高质量回答</p>
    </div>

    <!-- 表单 -->
    <form @submit.prevent="handleSubmit" class="px-6 py-5">
      <!-- 问题标题 -->
      <div>
        <label class="block text-sm font-medium text-gray-700">问题标题</label>
        <div class="relative mt-2">
          <input
              v-model="title"
              maxlength="80"
              placeholder="例如：如何在 Vue3 中实现 keep-alive 缓存嵌套路由？"
              class="w-full rounded-lg border border-gray-300 px-4 py-3 text-base placeholder-gray-400 focus:border-blue-500 focus:outline-none"
          />
          <span class="absolute right-3 bottom-3 text-xs text-gray-400">
            {{ title.length }}/80
          </span>
        </div>
      </div>

      <!-- 问题补充（富文本占位） -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700">问题补充（可选）</label>
        <textarea
            v-model="detail"
            placeholder="背景、条件、截图等详细信息..."
            rows="5"
            class="mt-2 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
        />
      </div>

      <!-- 添加话题 -->
      <div class="mt-6">
        <label class="block text-sm font-medium text-gray-700">
          添加话题 <span class="text-xs text-gray-500">（最多 5 个）</span>
        </label>
        <div class="mt-2 flex flex-wrap gap-2">
          <span
              v-for="item in topics"
              :key="item.id"
              class="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700"
          >
            # {{ item.name }}
            <button
                type="button"
                @click="removeTopic(item)"
                class="ml-2 text-blue-500 hover:text-blue-700"
            >
              <svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
              </svg>
            </button>
          </span>
          <div class="search-box w-full"      @blur="onBlur" ref="rootRef">
            <!-- 输入框 -->
            <input
                v-model="keyword"
                @focus="onFocus"

                @input="search"
                placeholder="请输入关键字"
                class="h-9 flex-1 w-full rounded-lg border border-dashed border-gray-300 px-3 text-sm placeholder-gray-400 focus:border-blue-500 focus:outline-none"
            />

            <!-- 下拉结果 -->
            <ul v-show="showList" class="search-list">
              <li
                  v-for="item in searchTopicRes"
                  :key="item.id"
                  @click="selectItem(item)"
              >
                {{ item.name }}<span class="ml-1 text-xs text-gray-500">{{ item.description || '' }}</span>
              </li>
              <li v-if="searchTopicRes.length===0" class="empty">无匹配数据</li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 底部按钮 -->
      <div class="mt-8 flex items-center justify-end gap-3">
        <button
            type="button"
            @click="$emit('cancel')"
            class="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          取消
        </button>
        <button
            :disabled="!canSubmit"
            :class="[
            'rounded-lg px-6 py-2 text-sm font-medium text-white',
            canSubmit
              ? 'bg-blue-600 hover:bg-blue-700'
              : 'cursor-not-allowed bg-gray-300'
          ]"
        >
          <span v-if="!loading">发布问题</span>
          <svg v-else class="mx-auto h-5 w-5 animate-spin" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import {computed, ref} from 'vue'
import {useTopicStore} from "@/stores/topic.ts";
import type {Topic,QuestionDto} from "@/utils/request/types.ts";
import {useUserStore} from "@/stores/user.ts";
import {useQuestionStore} from "@/stores/qusetion.ts";
import {debounce} from "@/utils";
import {ElMessage} from "element-plus";


const questionStore = useQuestionStore()
const userStore = useUserStore()
const searchTopicRes = ref<Topic[]>([])
const topicStore = useTopicStore()
const keyword = ref('')
const showList = ref(false)
/* 数据 */
const title = ref('')
const detail = ref('')
const topics = ref<Topic[]>([])

const loading = ref(false)

/* 计算 */
const canSubmit = computed(() => title.value.trim().length&&userStore.profile?.username || '')

/* 方法 */

function onFocus() {
  showList.value = true
}
function onBlur() {
  showList.value = false
}

const debounceSearch = debounce(async()=>{
  searchTopicRes.value.splice(0)
  const res: Topic[] = await topicStore.getTopicsByName(keyword.value)
   searchTopicRes.value.push( ...res)

}, 800)

function search() {
  debounceSearch(keyword.value)
}

function selectItem(item: Topic) {
  if(topics.value.length >= 5)return
  if (!topics.value.includes(item)){
    topics.value.push(item)
    showList.value = false
    keyword.value = ''
  }

}


function removeTopic(item: Topic) {
  topics.value.splice(topics.value.indexOf(item), 1)
}
async function handleSubmit() {
  if (!canSubmit.value) {
    ElMessage.error('请填写标题')
    return
  }
  const questionDto: QuestionDto = {
    title: title.value,
    detail: detail.value,
    topicIds: topics.value.map(item => item.id),
    authorId: userStore.profile!.id
  }

  await questionStore.createQuestion(questionDto)
  // 提交成功后清空
  title.value = ''
  detail.value = ''
  topics.value = []
  loading.value = false
}
</script>
<style scoped>
.search-box {
  position: relative;

  margin: 40px auto;
}
.search-box input {
  width: 100%;
  padding: 8px 12px;
  box-sizing: border-box;
}
.search-list {
  position: absolute;
  left: 0;
  right: 0;
  top: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ddd;
  background: #fff;
  max-height: 200px;
  overflow: auto;
}
.search-list li {
  padding: 8px 12px;
  cursor: pointer;
}
.search-list li:hover {
  background: #f5f5f5;
}
.search-list .empty {
  color: #999;
  cursor: default;
}
</style>