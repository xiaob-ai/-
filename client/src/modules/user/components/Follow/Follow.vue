<script setup lang="ts">
import userFollowRouteList from "@/router/modules/components/userFollowRouteList.ts";
import {computed} from "vue";
import {useRouter} from "vue-router";
import type {User} from "@/utils/request/types.ts";
defineProps<{
  user:User|null
}>()

const router = useRouter()
const activeRoute =computed(()=>{
  return userFollowRouteList.find(item=>item.name===router.currentRoute.value.name)
})
</script>

<template>
  <div class="p-2">
    <div class="border-y-[1px] border-gray-100 flex">
      <div class="mr-2 p-2"  :class="item.name===activeRoute?.name? 'text-black font-bold':'text-gray-500'" v-for="item in userFollowRouteList" @click="router.push({name:item.name})" :key="item.name">
        {{item.meta.title}}
      </div>
    </div>
  <router-view :user="user"></router-view>

  </div>
</template>

<style scoped>

</style>