<script setup lang="ts">
import type {Like, User} from "@/utils/request/types.ts"
import {onBeforeMount, ref, type Ref} from "vue";
import {useUserStore} from "@/stores/user.ts";
import {ElMessage} from "element-plus";

const userStore = useUserStore()
const props = defineProps<{
  like: Like
}>()
const userInfo:Ref<User|null> =ref(null)
onBeforeMount(async ()=>{
  userInfo.value =await userStore.getUserById(props.like.userId)
  await userStore.getFollowing()
  isFollowing.value= userStore.followingUser.some(item=>item.followUserId===props.like.userId)
})
const handleFollowBtn = async function () {
  if(userStore.profile!.id===userInfo.value!.id){
    ElMessage.warning('不能关注自己哦')
    return
  }
  if(isFollowing.value) {
    await userStore.cancelFollowUser({
      userId: userStore.profile!.id,
      followerId: userInfo.value!.id
    })
    isFollowing.value = false
    return
  }
  else {
    await userStore.followUser({
      followerId: userInfo.value!.id,
      userId: userStore.profile!.id
    })
    isFollowing.value = true
    return
  }
}
const isFollowing = ref(false)
</script>

<template>
<div class="flex items-center pb-2  justify-between">
  <div class="flex h-full cursor-pointer" @click="$router.push({name:'people',query:{id:userInfo?.id}});">
    <div class="rounded mr-2 h-full">
      <img loading="lazy" class="w-12 h-12" :src="userInfo?.avatar">
    </div>
    <div>
      <div class="text-2xl font-bold">{{userInfo?.username}}</div>
      <div class="text-sm text-gray-500">{{userInfo?.followerCount }}关注者</div>
    </div>
  </div>
  <div class=" text-white px-2 py-1 rounded cursor-pointer" :class="isFollowing?'bg-blue-200':'bg-primary'" @click="handleFollowBtn">
    {{isFollowing ? '取消关注' : '关注'}}
  </div>
</div>
</template>

<style scoped>

</style>