<script setup lang="ts">
import type {RouteRecordRaw} from "vue-router";
import {useRouter} from "vue-router";
interface Props{
  routeList?:Array<RouteRecordRaw>,
}
const router = useRouter()
withDefaults(defineProps<Props>(),{
  routeList:()=>[],
})


</script>


<template>
  <div class="absolute w-32 -left-[calc(64px-50%)] top-[100%]"  >
    <div class=" bg-white border p-2  ">
      <div v-for="item in routeList" @click="router.push(`/${item.meta?.module}/${item.path}`)" :key="item.name" class="cursor-pointer flex p-1 text-gray-500 hover:bg-gray-100 text-center border-b justify-between">
        <el-icon size="30" :color="item.meta?.iconColor" >
          <component  :is="item.meta?.icon"  ></component>
        </el-icon>
        <div class="text-xl mr-2">{{item.meta?.title}}</div>
      </div>
    </div>
    <div class="w-3 h-3 bg-white  absolute -top-[6px] left-[calc(50%-6px)]  border border-b-0 border-l-0 rotate-[-45deg]" ></div>
  </div>
</template>

<style scoped>

</style>