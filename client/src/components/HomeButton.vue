<script setup lang="ts">
import userRouteList from '@/router/modules/userRouteList';
import defaultAvatar from '@/assets/vue.svg'
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore();
const user = userStore.profile;
</script>

<template>
  <div   class="cursor-pointer relative flex text-gray-500 hover:text-black flex-col items-center">

    <el-popover trigger="click"  :width="120" placement="bottom">
      <template #reference>
        <div>
          <div class="rounded-full  bg-primary hover:cursor-pointer" >
            <img :src="user?.avatar || defaultAvatar" alt="avatar" class="w-10 h-10 rounded-full">
          </div>
        </div>
      </template>
      <div class="h-auto">
        <div v-for="item in userRouteList" @click="userStore.visitPeople=user;$router.push({name:item.name})" :key="item.name" class="cursor-pointer flex p-1 text-gray-500 items-center hover:bg-gray-100 text-center border-b ">
          <el-icon size="25"  >
            <component  :is="item.meta?.icon"  ></component>
          </el-icon>
          <div class="text=[20px] ml-2">{{item.meta?.title}}</div>
        </div>
      </div>
      <div class="cursor-pointer text-lg flex p-1  items-center justify-center hover:bg-gray-100 text-center   border-black  border-t-1 " @click="userStore.logout()">
        退出登入
      </div>
    </el-popover>
  </div>
</template>

<style scoped>

</style>