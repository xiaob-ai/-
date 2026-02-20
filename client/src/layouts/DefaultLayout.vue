<script setup lang="ts">

import TopNav from "@/components/TopNav/Layout.vue";
import {useAppStore} from "@/stores/app.ts";

const appStore = useAppStore()



</script>

<template>
  <div  class="bg-gray-100 min-h-screen"  :class="{'overflow-hidden h-screen':appStore.isShowCover}">
    <TopNav></TopNav>
    <router-view class="mx-auto"></router-view>
  </div>
</template>

<style scoped>



</style>