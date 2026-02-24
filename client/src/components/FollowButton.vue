<script setup lang="ts">
import {onMounted, ref} from "vue";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore()
const props= defineProps({
  userId:{
    type:String,
    required:true
  }
})
const isFollowing = ref(false)
const isLoading = ref(true)
onMounted(async()=>{
  await userStore.getFollowing()
  isFollowing.value =  userStore.followingUser.some(item=>item.followUserId ===props.userId )
})
const follow = async function () {
  isLoading.value = false
  if(isFollowing.value){
    await userStore.cancelFollowUser({
      userId: userStore.profile!.id,
      followerId: props.userId
    })
    isFollowing.value = false
  }else{
    await userStore.followUser({
      userId: userStore.profile!.id,
      followerId: props.userId
    })
    isFollowing.value = true
  }
  isLoading.value = true
}
</script>

<template>
  <div class="rounded   h-10 p-2 text-white " :class="{'bg-primary':!isFollowing, 'bg-blue-200':isFollowing}">
    <div v-if="isLoading">
      <div v-if="isFollowing" @click="follow">
        <span >取消关注</span>

      </div>
      <div v-else @click="follow" class="items-center flex">
        <el-icon><Plus />
        </el-icon>
        <span class="ml-1"> 关注</span>
      </div>
    </div>
    <div v-else>
      <el-icon><Loading /></el-icon>
    </div>
  </div>
</template>

<style scoped>

</style>