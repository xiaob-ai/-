<script setup lang="ts">

import {User} from "@element-plus/icons-vue";
</script>

<template>
  <el-card class="w-full mt-3 min-h-64">
    <header class="head flex justify-between items-center">
      <div class=" p-2 flex items-center leading-tight " >
        <el-icon size="20" >
          <User></User>
        </el-icon>
        <div class="leading-tight ">推荐关注</div>
      </div>

    </header>
    <main class="h-32 mt-2">
    </main>
  </el-card>
</template>

<style scoped>

</style>