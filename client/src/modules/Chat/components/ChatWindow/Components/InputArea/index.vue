<script setup lang="ts">
import {computed, ref} from "vue";
import {useChatStore} from "@/stores/chat";
import {useUserStore} from "@/stores/user.ts";
const userStore = useUserStore()
const chatStore = useChatStore()
const messageInput = ref('')
const canSend = computed<boolean>(() => {
  return messageInput.value.trim().length > 0 && messageInput.value.length <= 500
})
/** 处理回车发送 */
const handleEnter = (e: KeyboardEvent): void => {
  if (!e.shiftKey) {
    chatStore.sendMessage(messageInput.value, chatStore.currentChatter!.id,userStore.profile!.id)
    messageInput.value = ''
  } else {
    // Shift+Enter 换行
    messageInput.value += '\n'
    handleInput(e as unknown as Event)
  }
}
/** 处理输入 */
const handleInput = (e: Event): void => {
  const target = e.target as HTMLTextAreaElement
  target.style.height = 'auto'
  target.style.height = Math.min(target.scrollHeight, 120) + 'px'
}


</script>

<template>
  <!-- 输入区域 -->
  <div class="border-t border-[#f0f0f0] bg-white p-4">
    <!-- 工具栏 -->
    <div class="flex items-center gap-1 mb-2">
      <button
          class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
          title="表情"

      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>
      <button
          class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
          title="图片"

      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
      </button>
      <button
          class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
          title="文件"

      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/>
        </svg>
      </button>
      <div class="flex-1"></div>
      <span :class="['text-xs', messageInput.length > 450 ? 'text-[#f1403c]' : 'text-[#8590a6]']">
                {{ messageInput.length }}/500
      </span>
    </div>

    <!-- 输入框 -->
    <div class="relative">
              <textarea
                  ref="inputRef"
                  v-model="messageInput"
                  @keydown.enter.prevent="handleEnter"
                  @input="handleInput"

                  placeholder="输入私信内容..."
                  rows="3"
                  maxlength="500"
                  class="w-full px-3 py-2 bg-[#f6f6f6] border border-transparent focus:border-[#175199] focus:bg-white rounded-lg text-[15px] text-[#121212] placeholder-[#8590a6] outline-none resize-none transition-all pr-20"
              ></textarea>
      <button
          @click="chatStore.sendMessage(messageInput, chatStore.currentChatter!.id,userStore.profile!.id);messageInput=''"
          :disabled="!canSend"
          :class="[
                  'absolute bottom-2 right-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                  canSend
                    ? 'bg-[#175199] text-white hover:bg-[#134d88] active:scale-95'
                    : 'bg-[#e7e7e7] text-[#8590a6] cursor-not-allowed'
                ]"
      >
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>