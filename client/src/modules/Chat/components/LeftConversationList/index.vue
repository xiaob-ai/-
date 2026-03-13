<script setup lang="ts">

import ConversationItem from "./Components/ConversationItem/index.vue"
import {useChatStore} from "@/stores/chat.ts";
import {useUserStore} from "@/stores/user.ts"
import {computed, ref} from "vue";
import {storeToRefs} from "pinia";
import type {Conversation} from "@/utils/request/chat/types.ts";



const chatStore = useChatStore();
const userStore = useUserStore();

const {conversations,currentChatter}= storeToRefs(chatStore)




const searchQuery = ref('')
const filteredChats = computed(() => {
  if(!searchQuery.value.trim()){
    return conversations.value
  }
  return conversations.value.filter((chat)=>{
    return chat.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  })
})


const selectChat = (chat:Conversation) => {
  chatStore.joinChat(chat.userId,userStore.profile!.id)
}
</script>

<template>
  <!-- 左侧：会话列表 -->
  <div class="w-full md:w-[280px] border-b md:border-b-0 md:border-r border-[#e7e7e7] flex flex-col bg-white">
    <!-- 头部 -->
    <div class="h-14 px-4 flex items-center justify-between border-b border-[#f0f0f0]">
      <h2 class="text-lg font-semibold text-[#121212]">私信</h2>
    </div>

    <!-- 搜索框 -->
    <div class="px-3 py-3">
      <div class="relative">
        <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索联系人"
            class="w-full h-9 pl-9 pr-3 bg-[#f6f6f6] border border-transparent focus:border-[#175199] focus:bg-white rounded-md text-sm text-[#121212] placeholder-[#8590a6] outline-none transition-all"
        >
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8590a6]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
      </div>
    </div>

    <!-- 会话列表 -->
    <div class="flex-1 overflow-y-auto" >
      <div
          v-for="chat in filteredChats"
          :key="chat.id"

          @click="selectChat(chat)"
          :class="[
              'flex items-center px-4 py-3 cursor-pointer transition-all hover:bg-[#f6f6f6] border-l-[3px]',
              currentChatter?.id === chat.userId ? 'bg-[#f6f6f6] border-[#175199]' : 'border-transparent'
            ]"
      >

        <ConversationItem :chat="chat" />
      </div>

      <!-- 无搜索结果 -->
      <div v-if="filteredChats.length === 0" class="px-4 py-8 text-center text-[#8590a6] text-sm">
        未找到相关联系人
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>