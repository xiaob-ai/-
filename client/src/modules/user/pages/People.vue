<script setup lang="ts">
import MainTopBar from "@/modules/user/components/MainTopBar.vue";
import AsideFooter from "@/modules/user/components/AsideFooter.vue";
import CanvasStarry from "@/modules/user/components/CanvasStarry.vue";
import {useUserStore} from "@/stores/user.ts";
import {computed, onBeforeMount,} from "vue";
import { useRouter} from "vue-router";

import FollowButton from "@/components/FollowButton.vue";
const router = useRouter();
const userStore = useUserStore();


let isOther =computed(()=>{
  return userStore.profile?.id !== userStore.visitPeople?.id
})

onBeforeMount(async()=>{

  const userId:any= router.currentRoute.value.query.id
  if(userId){

    userStore.visitPeople= await userStore.getUserById(userId)
  }
  else{

    userStore.visitPeople= userStore.profile
  }
})

</script>

<template>
  <div class="w-[var(--main-width)]  min-h-screen">

      <header class="my-3  w-full">
        <div class="w-full bg-white h-[320px] " >
          <div class="h-1/2 w-full    relative p-3">
              <CanvasStarry></CanvasStarry>
              <div class="bg-gray-500 flex items-center opacity-80 text-white text-center w-20 h-5 rounded  absolute bottom-3 right-3 ">
                <el-icon><Position /></el-icon>
                <span class="text-xs">IP属地 {{userStore.visitPeople?.location||'未知'}}</span>
              </div>
          </div>
          <div class="relative h-1/2 w-full flex    p-5 justify-between">
            <div class="h-full flex">
              <div class="p-2 relative -top-16 rounded  bg-white w-40 h-40 ">
                <img :src="userStore.visitPeople?.avatar||userStore.defaultAvartar" alt="avatar" class="bg-primary w-full h-full">
              </div>
              <div class="ml-4">
                <h1 class="text-3xl font-bold">{{userStore.visitPeople?.username||'匿名用户'}}</h1>
                <p class="text-sm">{{userStore.visitPeople?.bio||'暂无简介'}}</p>
              </div>
            </div>
            <div class="h-full flex items-end">
              <div class="rounded   h-10 border border-primary p-2 text-primary " v-if="!isOther">编辑个人资料</div>
              <follow-button v-else :userId="userStore.visitPeople!.id"/>
            </div>
          </div>
        </div>
      </header>
      <main class="w-full flex">
        <el-card class="min-h-screen mr-3 w-[720px]">
          <MainTopBar></MainTopBar>
          <router-view :user="userStore.visitPeople"></router-view>
        </el-card>
        <aside class="flex-1">
          <el-card class="w-full h-[200px]">
          </el-card>
          <el-card class="w-full h-[100px] mt-3"></el-card>
          <aside-footer></aside-footer>
        </aside>
      </main>

  </div>
</template>

<style scoped>

</style>