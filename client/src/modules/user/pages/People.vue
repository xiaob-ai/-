<script setup lang="ts">
import MainTopBar from "@/modules/user/components/MainTopBar.vue";
import AsideFooter from "@/modules/user/components/AsideFooter.vue";
import CanvasStarry from "@/modules/user/components/CanvasStarry.vue";
import {useUserStore} from "@/stores/user.ts";
import { onMounted, ref, type Ref} from "vue";
import {useRouter} from "vue-router";
import type{User} from "@/utils/request/types.ts"
const router = useRouter();
const userStore = useUserStore();

const user:Ref<User|null>= ref(null)
let isOther = ref(false)
let isFollowing = ref(false)
onMounted(async()=>{
  const userId:any= router.currentRoute.value.query.id

  if(userId){
    isOther.value= true
    user.value = await userStore.getUserById(userId)
  }
  else{
    isOther.value= false
    user.value = userStore.profile
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
                <span class="text-xs">IP属地 {{user?.location||'未知'}}</span>
              </div>
          </div>
          <div class="relative h-1/2 w-full flex    p-5 justify-between">
            <div class="h-full flex">
              <div class="p-2 relative -top-16 rounded  bg-white w-40 h-40 ">
                <img :src="user?.avatar||userStore.defaultAvartar" alt="avatar" class="bg-primary w-full h-full">
              </div>
              <div class="ml-4">
                <h1 class="text-3xl font-bold">{{user?.username||'匿名用户'}}</h1>
                <p class="text-sm">{{user?.bio||'暂无简介'}}</p>
              </div>
            </div>
            <div class="h-full flex items-end">
              <div class="rounded   h-10 border border-primary p-2 text-primary " v-if="!isOther">编辑个人资料</div>
              <div class="rounded   h-10 p-2 text-white " :class="{'bg-primary':!isFollowing, 'bg-blue-200':isFollowing}" v-else>
                <div v-if="isFollowing" @click="isFollowing=false">
                     <span >取消关注</span>

                </div>
                <div v-else @click="isFollowing=true" class="items-center flex">
                  <el-icon><Plus />
                  </el-icon>
                     <span class="ml-1"> 关注</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main class="w-full flex">
        <el-card class="min-h-screen mr-3 w-[720px]">
          <MainTopBar></MainTopBar>
          <router-view></router-view>
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