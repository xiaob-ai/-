<script setup lang="ts">
import {useUserStore} from "@/stores/user.ts";
import type {User} from "@/utils/request/types.ts";
import {computed, onMounted, ref} from "vue";
import UserItem from "@/modules/user/components/Follow/components/UserItem.vue";
const userStore = useUserStore()
const props = defineProps<{
  user:User|null
}>()

const followersList = ref<User[]>([])
const isItemShow = computed(()=>{
  return followersList.value.length>0
})
onMounted(async()=>{
      if(props.user){
        const res = await userStore.getFollowedUsersByUserId(props.user.id)
        if( res) {
          for (const item of res) {
            const user=await userStore.getUserById(item.userId)
            if(user) followersList.value.push(user)
          }
        }
      }
    }
)
</script>

<template>
  <div v-for="item in followersList" v-if="isItemShow" :key="item.id">
    <UserItem :user="item"></UserItem>
  </div>
</template>

<style scoped>

</style>