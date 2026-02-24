<script setup lang="ts">
import {useUserStore} from "@/stores/user.ts";
import type {User} from "@/utils/request/types.ts";
import {computed, onMounted, ref} from "vue";
import UserItem from "@/modules/user/components/Follow/components/UserItem.vue";
const userStore = useUserStore()
const props = defineProps<{
  user:User|null
}>()
const followingList = ref<User[]>([])
const isItemShow = computed(()=>{
  return followingList.value.length>0
})
onMounted(async()=>{
  if(props.user){
    const res = await userStore.getFollowingUsersByUserId(props.user.id)
    if( res) {
      for (const item of res) {
        const user=await userStore.getUserById(item.followUserId)
        if(user) followingList.value.push(user)
      }
    }
  }
}
)
</script>

<template>
<div v-for="item in followingList" v-if="isItemShow" :key="item.id">
  <UserItem :user="item"></UserItem>
</div>
</template>

<style scoped>

</style>