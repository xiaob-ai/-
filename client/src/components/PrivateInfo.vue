<script setup lang="ts">

import {Comment} from "@element-plus/icons-vue";
import {messageService} from "@/utils/request";
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/user.ts";
import type {Message} from "@/utils/request/chat/types.ts";
import InfoItem from "@/components/TopNav/components/InfoItem.vue";
const messages = ref<Message[]>([])
const userStore = useUserStore()
onMounted(async()=>{
  if(!userStore.profile){return}
  messages.value= await messageService.getUnreadMessages(userStore.profile!.id)
})
const clearMes =(senderId:string)=>{
  messages.value= messages.value.filter(message=>message.senderId!==senderId)
}
</script>

<template>
  <div   class="cursor-pointer flex relative text-gray-500 hover:text-black flex-col items-center">
    <el-popover trigger="click"  :width="320" placement="bottom">
      <template #reference>
        <div class="relative">
          <div class="text-xs w-4 h-4 -right-2 -top-2 bg-danger text-center absolute rounded-full text-white" v-if="messages.length">{{ messages.length }}</div>
          <component :is="Comment"></component>
          <div class="text-xs">私信</div>
        </div>
      </template>
      <div class="h-96">
        <header class="pb-2  w-full border-b text-center">私信</header>
        <div v-for="message in messages" :key="message.id" >
          <InfoItem @jumpToChat="clearMes" :msg="message"></InfoItem>
        </div>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>

</style>