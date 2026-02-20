<script setup lang="ts">

import RightSelectAnswer from "@/modules/post/components/RightSelectAnswer.vue";
import LeftBar from "@/modules/post/components/LeftBar.vue";
</script>

<template>
  <div class="grid grid-cols-1 gap-5 lg:grid-cols-12" >
    <!-- 左侧分类 -->
    <LeftBar ></LeftBar>
    <!-- 右侧问题列表 -->
    <RightSelectAnswer></RightSelectAnswer>

  </div>
</template>

<style scoped>

</style>