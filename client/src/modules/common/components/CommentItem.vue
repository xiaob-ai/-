<script setup lang="ts">


import {computed, onMounted, ref} from "vue";
import type {User} from "@/utils/request/types.ts";
import type{Comment} from "@/utils/request/types.ts";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore()
const props = defineProps<{
  comment: Comment | null
}>()
const user = ref<User | null>(null)
onMounted(async () => {
  if (props.comment) {

    const res :User|null=await userStore.getUserById(props.comment.userId)
    if(res)user.value = res
  }
})
const createTime = computed(() => {
  if (props.comment) {
    const date = new Date(props.comment.createdAt)
    return date.toLocaleString()
  }
  return '未知时间'
})
</script>

<template>
  <div class="p-2 flex">
    <div class="mr-1 ">
      <img class="w-8 h-8 rounded-full bg-white" loading="lazy" :src="user?.avatar||'https://picsum.photos/id/237/200/300' " alt="">
    </div>
    <div class="flex-1 ">
      <header  class="font-bold text-xl ">{{user?.username ||'未知用户'}}</header>
      <main class="text-sm mt-2">{{props.comment?.content ||'无内容'}}</main>
      <footer class="text-xs text-gray-500">{{createTime}} · {{user?.location ||'未知位置'}}</footer>
    </div>
  </div>
</template>

<style scoped>

</style>