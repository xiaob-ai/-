<!-- src/components/AppNavbar.vue -->
<template>
  <header class="sticky grid grid-cols-2 justify-around top-0 z-50 w-full shadow border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur">
    <div class="flex h-14 max-w-6xl  items-center justify-center px-4 ">
      <!-- Logo -->
      <RouterLink to="/" class="mr-6 text-4xl font-bold text-blue-600 dark:text-blue-400">知乎</RouterLink>
      <top-nav-left-menu></top-nav-left-menu>
    </div>
    <!-- 右侧按钮区 -->
    <div class=" flex   items-center justify-center ">
      <div class="hidden mx-2 md:flex flex-1 max-w-md">
        <search-input></search-input>
      </div>
      <div class="relative"  @mouseover="isBubbleShow=true" @mouseout="isBubbleShow=false">
        <el-icon size="30px" class="text-white bg-info rounded-full p-1" ><Plus></Plus></el-icon>
        <Bubble width="64px" v-show="isBubbleShow" :routeList="postRouteList"></Bubble>
      </div>



      <top-nav-right-menu></top-nav-right-menu>
    </div>
  </header>
</template>

<script setup lang="ts">

import postRouteList from "@/router/modules/postRouteList.ts";
import SearchInput from "@/components/SearchInput.vue";
import TopNavLeftMenu from "@/components/TopNav/TopNavLeftMenu.vue";
import {Plus} from "@element-plus/icons-vue";
import TopNavRightMenu from "@/components/TopNav/TopNavRightMenu.vue";
import Bubble from "@/components/Bubble.vue";
import {ref} from "vue";

const isBubbleShow = ref(false)

</script>