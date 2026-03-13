<script setup lang="ts">
import ChatHeader from "./Components/ChatHeader/index.vue";
import MesArea from "./Components/MesArea/index.vue";
import InputArea from "./Components/InputArea/index.vue";
import {useChatStore} from "@/stores/chat.ts";

const chatStore = useChatStore();

</script>

<template>
  <!-- 右侧：聊天窗口 -->
  <div class="flex-1 flex flex-col bg-white min-w-0 relative">
    <template v-if="chatStore.currentChatter">
      <ChatHeader />

      <MesArea/>

      <input-area/>
    </template>

    <!-- 空状态 -->
    <div v-else class="flex-1 flex flex-col items-center justify-center text-[#8590a6]">
      <div class="w-24 h-24 mb-4 bg-[#f6f6f6] rounded-full flex items-center justify-center">
        <svg class="w-12 h-12 text-[#e7e7e7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
        </svg>
      </div>
      <p class="text-base font-medium">选择一个会话开始聊天</p>
      <p class="text-sm mt-1 opacity-60">或与关注的人发起新对话</p>
      <button
          class="mt-4 px-4 py-2 bg-[#175199] text-white rounded-md text-sm hover:bg-[#134d88] transition-colors"
      >
        发起新对话
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>