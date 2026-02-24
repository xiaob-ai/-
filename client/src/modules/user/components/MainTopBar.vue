<script setup lang="ts">
import userMainRouteList from "@/router/modules/components/userMainRouteList.ts";
import {useRouter} from "vue-router";
import {computed} from "vue";

const router = useRouter();
const activeName = computed(()=> {
  const currentRouteName = router.currentRoute.value.name as string
  if(currentRouteName.includes("follow")){
    return "followPeople"
  }
  else{
    return currentRouteName
  }
})
function handleSelect(key:string){
  router.push({name: key})
}
</script>

<template>
  <el-menu mode="horizontal" @select="handleSelect" :default-active="activeName">
    <el-menu-item v-for="item in userMainRouteList" :key="item.name" :index="item.name">
      <div class="font-bold text-xl">
        {{item.meta.title}}
      </div>
    </el-menu-item>
  </el-menu>
</template>

<style scoped>

</style>