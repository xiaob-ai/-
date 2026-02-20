<script setup lang="ts">
import userMainRouteList from "@/router/modules/components/userMainRouteList.ts";
import {useRouter} from "vue-router";

const router = useRouter();
function handleSelect(key:string){
  router.push(`/user/people/${key}`)
}
</script>

<template>
  <el-menu mode="horizontal" @select="handleSelect" :default-active="userMainRouteList[0]?.name">
    <el-menu-item v-for="item in userMainRouteList" :key="item.name" :index="item.name">
      <div class="font-bold text-xl">
        {{item.meta.title}}
      </div>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>