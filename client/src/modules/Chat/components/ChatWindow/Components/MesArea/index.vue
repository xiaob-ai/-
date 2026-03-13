<script setup lang="ts">
import {useChatStore} from "@/stores/chat.ts";

import {computed} from "vue";
import {storeToRefs} from "pinia";
import MessageItem from "./Components/MessageItem/index.vue"


const currentUser = computed(() => {
  return chatStore.currentChatter
})
const chatStore = useChatStore()

const messages = storeToRefs(chatStore).currentChatHistory

/** 显示时间分隔线判断 */
const shouldShowTimeDivider = (index: number): boolean => {
  if (index === 0) return true
  const prev = new Date(messages.value[index - 1]!.createdAt)
  const curr = new Date(messages.value[index]!.createdAt)

  return (curr.getTime() - prev.getTime()) > 300000 // 5分钟
}
/** 格式化消息时间 */
const formatMessageTime = (date: Date): string => {
  return new Date(date).toLocaleString()
}

</script>

<template>
  <!-- 消息区域 -->
  <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-4 py-4 bg-white scroll-smooth"
  >
    <div class="space-y-4">
      <div
          v-for="(msg, index) in messages"
          :key="msg.id"
          class="flex flex-col animate-fade-in"
      >
        <!-- 时间分隔线 -->
        <div v-if="shouldShowTimeDivider(index)" class="flex items-center justify-center my-4">
                  <span class="text-xs text-[#8590a6] bg-[#f6f6f6] px-3 py-1 rounded-full">
                    {{ formatMessageTime(msg.createdAt) }}
                  </span>
        </div>
        <MessageItem :msg="msg" :currentUser="currentUser!" />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 动画 */
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.3s ease-out;
}
</style>