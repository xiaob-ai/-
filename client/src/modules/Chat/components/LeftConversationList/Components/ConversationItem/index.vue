<script setup lang="ts">

import type {Conversation} from "@/utils/request/chat/types.ts";

interface Props {
  chat: Conversation

}
defineProps<Props>()


</script>

<template>
  <div class="relative">
    <img alt="avatar" :src="chat.avatar" class="w-10 h-10 rounded-full object-cover border border-[#e7e7e7]">
    <div
        v-if="chat.unread > 0"
        class="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 bg-[#f1403c] rounded-full flex items-center justify-center text-[10px] text-white font-medium border-2 border-white px-1"
    >
      {{ chat.unread > 99 ? '99+' : chat.unread }}
    </div>
    <div v-if="chat.online" class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#12b886] rounded-full border-2 border-white"></div>
  </div>
  <div class="ml-3 flex-1 min-w-0">
    <div class="flex items-center justify-between mb-0.5">
      <span class="text-[15px] font-medium text-[#121212] truncate">{{ chat.name }}</span>
      <span class="text-xs text-[#8590a6] whitespace-nowrap">{{ chat.lastMessageTime && new Date(chat.lastMessageTime!).toLocaleString() }}</span>
    </div>
    <p class="text-sm text-[#8590a6] truncate">{{ chat.lastMessage?.content }}</p>
  </div>
</template>

<style scoped>

</style>