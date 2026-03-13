<!-- ZhihuChat.vue -->
<template>
  <div class="min-h-screen bg-[#f6f6f6] flex justify-center py-8 px-4 font-sans">
    <!-- 主容器 -->
    <div class="w-full max-w-[888px] bg-white rounded-lg shadow-sm border border-[#e7e7e7] overflow-hidden flex flex-col md:flex-row h-[calc(100vh-4rem)] md:h-[700px]">

      <!-- 左侧：会话列表 -->
      <left-conversation-list v-if="chatStore.conversationIsLoading"/>

      <!-- 右侧：聊天窗口 -->
       <chat-window />
    </div>




  </div>
</template>

<script setup lang="ts">
import LeftConversationList from "@/modules/Chat/components/LeftConversationList/index.vue";
import ChatWindow from "@/modules/Chat/components/ChatWindow/index.vue";
import { onMounted,onUnmounted } from 'vue'
import {useChatStore} from "@/stores/chat.ts";
import {useUserStore} from "@/stores/user.ts";
import {useRouter} from "vue-router";
const userStore = useUserStore()
const router = useRouter()
const {token} = useUserStore()
const chatStore = useChatStore()

onMounted(() => {
  chatStore.connect(token)
  const chatterId= router.currentRoute.value.query.id as string
  if(chatterId){
    chatStore.joinChat(chatterId,userStore.profile!.id)
  }
})
onUnmounted(() => {
  chatStore.disconnect()
})
</script>

<style scoped>
/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d3d3d3;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b3b3b3;
}

/* 选中文字颜色 */
::selection {
  background: rgba(23, 81, 153, 0.2);
  color: #175199;
}



@keyframes slide-down {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}


</style>