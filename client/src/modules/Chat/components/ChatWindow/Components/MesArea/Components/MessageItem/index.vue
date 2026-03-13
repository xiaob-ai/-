<script setup lang="ts">
import type {ChatUser, Message} from "@/utils/request/chat/types.ts";
import {useUserStore} from "@/stores/user.ts";
const userStore = useUserStore()
interface Props {
  msg: Message;
  currentUser: ChatUser;
}
const props = defineProps<Props>()
const isSelf: boolean = props.msg.senderId !== props.currentUser.id
</script>

<template>
  <!-- 消息气泡 -->
  <div :class="['flex items-end gap-3', isSelf ? 'flex-row-reverse' : '']">
    <img
        :src="isSelf ? userStore.profile!.avatar : currentUser!.avatar"
        class="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#e7e7e7] cursor-pointer hover:opacity-80 transition-opacity"

    >

    <div :class="['flex flex-col max-w-[70%]', isSelf ? 'items-end' : 'items-start']">


      <!-- 消息内容 -->
      <div
          :class="[
                        'px-4 py-2.5 rounded-lg text-[15px] leading-relaxed break-words relative group transition-all',
                        isSelf
                          ? 'bg-[#175199] text-white rounded-br-sm hover:bg-[#134d88]'
                          : 'bg-[#f6f6f6] text-[#121212] rounded-bl-sm border border-[#e7e7e7] hover:bg-[#f0f0f0]'
                      ]"
      >
        {{ msg.content }}

        <!-- 操作按钮（悬停显示） -->
        <div
            :class="[
                          'absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all flex gap-1 bg-white shadow-sm rounded-md p-0.5 border border-[#e7e7e7]',
                          isSelf ? 'right-full mr-2' : 'left-full ml-2'
                        ]"
        >
          <button

              class="p-1 hover:bg-[#f6f6f6] rounded text-[#8590a6] hover:text-[#175199]"
              title="引用"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"/>
            </svg>
          </button>
          <button
              v-if="isSelf"

              class="p-1 hover:bg-[#f6f6f6] rounded text-[#8590a6] hover:text-[#f1403c]"
              title="撤回"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>