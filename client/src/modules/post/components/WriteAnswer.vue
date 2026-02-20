<!-- WriteAnswer.vue -->
<template>
  <div class=" w-full min-h-screen bg-gray-50" >
    <div class="mx-auto w-[700px]  max-w-5xl px-4 py-6">
      <!-- 问题卡片 -->
      <div class="rounded-xl  bg-white p-5 shadow-sm">
        <h1 class="text-lg font-semibold text-gray-900">
          {{ questionStore.question!.title }}
        </h1>
        <p class="mt-2 text-sm text-gray-600">
          {{ questionStore.question!.detail }}
        </p>
        <div class="mt-3 flex items-center gap-2 text-xs text-gray-500">
          <span v-for="t in questionStore.question!.topics" :key="t.id" class="rounded bg-gray-100 px-2 py-0.5">
            # {{ t.name }}
          </span>
        </div>
      </div>

      <!-- 写答案区 -->
      <div class="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        <!-- 左侧用户信息 -->
        <aside class="lg:col-span-3">
          <div class="sticky top-5 rounded-xl bg-white p-4 shadow-sm">
            <img
                :src="userStore?.profile?.avatar || userStore.defaultAvartar"
                class="h-14 w-14 rounded-full"
                alt="avatar"
            />
            <div class="mt-3 font-semibold text-gray-900">{{ userStore?.profile?.username  || '暂无名称'}}</div>
            <div class="mt-1 text-sm text-gray-500">{{ userStore.profile?.bio || '暂无简介'}}</div>
          </div>
        </aside>

        <!-- 中间编辑器 -->
        <main class="lg:col-span-9">
          <div class="rounded-xl bg-white shadow-sm">
            <!-- 工具栏 -->
            <div class="flex items-center gap-2 border-b border-gray-100 px-4 py-3">
              <button
                  type="button"
                  @click="insertImage"
                  class="rounded p-2 hover:bg-gray-100"
                  title="插入图片"
              >
                <svg class="h-5 w-5 text-gray-600"><use href="#icon-image" /></svg>
              </button>
              <button
                  type="button"
                  @click="mention"
                  class="rounded p-2 hover:bg-gray-100"
                  title="@提及"
              >
                <svg class="h-5 w-5 text-gray-600"><use href="#icon-mention" /></svg>
              </button>
              <div class="ml-auto text-sm text-gray-400">
                字数 {{ contentLength }}（不少于 15 字）
              </div>
            </div>

            <!-- 编辑区 -->
            <textarea
                ref="editorRef"
                v-model="content"
                @input="onInput"
                class="min-h-[320px]  resize-none w-full px-4 py-4 text-base leading-relaxed text-gray-800 focus:outline-none"
                placeholder="写你的回答..."
            ></textarea>

            <!-- 底部操作 -->
            <div class="flex items-center justify-end gap-3 border-t border-gray-100 px-4 py-4">
              <button
                  type="button"
                  @click="saveDraft"
                  class="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                保存草稿
              </button>
              <button
                  :disabled="!canSubmit"
                  @click="submitAnswer"
                  class="rounded-lg px-6 py-2 text-sm font-medium text-white"
                  :class="canSubmit ? 'bg-blue-600 hover:bg-blue-700' : 'cursor-not-allowed bg-gray-300'"
              >
                <span v-if="!loading">发布回答</span>
                <svg v-else class="mx-auto h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"/>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                </svg>
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  </div>

  <!-- SVG 图标集合 -->
  <svg style="display:none">
    <symbol id="icon-image" viewBox="0 0 24 24"><path fill="currentColor" d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></symbol>
    <symbol id="icon-mention" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2a10 10 0 100 20 10 10 0 000-20zm0 18a8 8 0 110-16 8 8 0 010 16zm0-13a5 5 0 00-5 5c0 1.47.63 2.79 1.64 3.7l-1.41 1.42A6.96 6.96 0 015 12a7 7 0 0112.6-4.3l-1.42 1.44A4.96 4.96 0 0012 7z"/></symbol>
  </svg>
</template>

<script setup lang="ts">
import {computed, onBeforeMount, onMounted, ref} from 'vue'
import {useUserStore} from "@/stores/user.ts";
import {useQuestionStore} from "@/stores/qusetion.ts";
import {useAnswerStore} from "@/stores/answer.ts";
import {ElMessage} from "element-plus";
import {useRouter} from 'vue-router'

const router = useRouter()
const answerStore = useAnswerStore()
const questionStore = useQuestionStore()
const userStore = useUserStore()
const content = ref('')
onBeforeMount(()=>{
  if(!questionStore.question){
    router.push('/')
  }
})
onMounted(()=>{

  content.value=answerStore.answerDraft
  onInput()
})
/* 编辑器 */
const editorRef = ref<HTMLDivElement>()
const contentLength = ref(0)

function onInput() {
  contentLength.value = content.value.trim().length
}

/* 工具栏 */
function insertImage() {
  const url = prompt('请输入图片地址：')
  if (!url) return
  document.execCommand('insertImage', false, url)
}
function mention() {
  document.execCommand('insertText', false, '@')
}

/* 提交 */
const loading = ref(false)
const canSubmit = computed(() => contentLength.value >= 15)

async function submitAnswer() {
  if (!canSubmit.value) return
  loading.value = true

  if(await answerStore.createAnswer(userStore.profile!.id,questionStore.question!.id,content.value)){
    ElMessage.success('创建成功！')
  }
  else{
    ElMessage.error('创建失败！')
  }

  loading.value = false

  // 这里可以跳转 / 清空
}
function saveDraft() {
  if (!questionStore.question) {
    ElMessage.error('问题异常！')
    //返回上一页
    router.go(-1)

  }
  answerStore.answerDraft = content.value || ''
  ElMessage.success('保存成功！')

}
</script>