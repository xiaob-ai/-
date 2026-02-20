<script setup lang="ts">
import commonRouteList from "@/router/modules/commonRouteList.ts";



</script>

<template>
  <div class="flex h-full  pt-1">
    <el-anchor direction="horizontal" class="h-full flex items-end " >
      <el-anchor-link v-for="item in commonRouteList"   :key="item.name" class="pb-1" @click="$router.push(item.path)">
        <div class="text-[14px] font-bold hover:translate-y-1  border-secondary" :class="{'text-sm border-b-2 border-primary text-black':item.path==$route.path}" >{{item.meta.title}}</div>
      </el-anchor-link>
    </el-anchor>
  </div>
</template>

<style scoped>

</style>