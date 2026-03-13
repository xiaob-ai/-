<script setup lang="ts">
import {useChatStore} from "@/stores/chat.ts";
import {computed, ref} from "vue";
const chatStore = useChatStore()
const currentChat = computed(() => chatStore.currentChatter)
const showChatMenu = ref(false)
</script>

<template>
  <!-- 聊天头部 -->
  <div class="h-14 px-4 flex items-center justify-between border-b border-[#f0f0f0] bg-white">
    <div class="flex items-center gap-3">
      <img :src="currentChat!.avatar" class="w-8 h-8 rounded-full object-cover">
      <div>
        <h3 class="text-[15px] font-semibold text-[#121212]">{{ currentChat?.username }}</h3>
        <p v-if="currentChat!.isOnline" class="text-xs text-[#8590a6]">在线</p>
        <p v-else class="text-xs text-[#8590a6]">{{  '上次在线 2小时前' }}</p>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <button
          class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
          title="查看资料"

      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
        </svg>
      </button>
      <button
          class="p-2 hover:bg-[#f6f6f6] rounded-full transition-colors text-[#8590a6] hover:text-[#175199]"
          title="更多操作"
          @click="showChatMenu = !showChatMenu"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"/>
        </svg>
      </button>

      <!-- 下拉菜单 -->
      <div v-if="showChatMenu" class="absolute right-4 top-12 bg-white border border-[#e7e7e7] rounded-lg shadow-lg py-1 z-10 min-w-[120px]">
        <button
            class="w-full px-4 py-2 text-left text-sm text-[#f1403c] hover:bg-[#f6f6f6] transition-colors"

        >
          删除会话
        </button>
        <button
            class="w-full px-4 py-2 text-left text-sm text-[#121212] hover:bg-[#f6f6f6] transition-colors"

        >
          屏蔽用户
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>