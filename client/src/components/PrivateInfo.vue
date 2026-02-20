<script setup lang="ts">

import {Comment} from "@element-plus/icons-vue";
</script>

<template>
  <div   class="cursor-pointer flex relative text-gray-500 hover:text-black flex-col items-center">
    <el-popover trigger="click"  :width="320" placement="bottom">
      <template #reference>
        <div>
          <component :is="Comment"></component>
          <div class="text-xs">私信</div>
        </div>
      </template>
      <div class="h-96">

      </div>
    </el-popover>
  </div>
</template>

<style scoped>

</style>