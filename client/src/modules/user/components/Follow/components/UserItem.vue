<script setup lang="ts">
import type {User} from "@/utils/request/types.ts";
import {useUserStore} from "@/stores/user.ts";
import FollowButton from "@/components/FollowButton.vue";
const userStore = useUserStore()
defineProps<{
  user:User|null
}>()
</script>

<template>
<div class="my-2 p-2 flex justify-between border-b border-gray-200">
  <div class="flex">
    <div>
      <img class="w-12 h-12 rounded" :src="user?.avatar" :alt="user?.avatar">
    </div>
    <div class="ml-2">
      <div class="font-bold mr-2 cursor-pointer" @click="userStore.visitPeople=user;$router.push({name:'people',query:{id:user?.id}}) ">

        {{user?.username}}

      </div>
      <div class="text-xs text-gray-500">
        {{user?.headline?user?.headline:'暂无简介'}}
      </div>
      <div class="flex text-xs text-gray-500">
        {{user?.followerCount}}个粉丝·{{user?.followingCount}}关注·{{user?.voteCount}}赞同
      </div>
    </div>
  </div>
  <FollowButton v-if="user" :userId="user.id"></FollowButton>
</div>
</template>

<style scoped>

</style>