<script setup lang="ts">

import {Bell} from "@element-plus/icons-vue";
</script>

<template>
  <div   class="cursor-pointer relative flex text-gray-500 hover:text-black flex-col items-center">

    <el-popover trigger="click"  :width="320" placement="bottom">
      <template #reference>
        <div>
          <component :is="Bell"></component>
          <div class="text-xs head">消息</div>
        </div>
      </template>
      <div class="h-96">
        <h1 class="border-b text-center w-full pb-2">我的消息</h1>
      </div>
    </el-popover>
  </div>
</template>

<style scoped>

</style>