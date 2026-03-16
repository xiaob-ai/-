<script setup lang="ts">
import type {Message} from "@/utils/request/chat/types.ts";
import {useUserStore} from "@/stores/user.ts";
import {onMounted, ref} from "vue";
import type {User} from "@/utils/request/types.ts";

interface Props {
  msg:Message
}
defineEmits(['jumpToChat'])
const props = defineProps<Props>()
const sender =ref<User>()
onMounted(async()=>{
  sender.value = await useUserStore().getUserById(props.msg.senderId) as User
})
</script>

<template>
  <div class="p-2 cursor-pointer hover:bg-gray-50" @click=" $emit('jumpToChat',sender!.id);$router.push({name:'private',query:{id:sender!.id}});" v-if="sender">
      <div class="font-bold text-xl">{{sender?.username}}：</div>
      <div class="text-sm ">{{props.msg.content}}</div>
  </div>
</template>

<style scoped>

</style>