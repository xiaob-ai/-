<script setup lang="ts">
import {computed, onMounted, ref} from "vue";

import {Plus} from "@element-plus/icons-vue";


const props=defineProps({
  label:{
    type:String,
    required:true
  },
  value:{
    type:String,
    required:true
  },
  itemKey:{
    type:String,
    required:true
  }
})
const emits= defineEmits(
    ['alterInfo']
)
// 编辑模式或者信息显示
const mode = ref<"edit" | "view">("view");
// 决定打开编辑按钮是否显示
const isActiveEditBtnShow=ref(false)
const isCreateOrUpdate=computed<"修改"|"添加">(()=>{
  return props.value.length>0?"修改":"添加"
})
onMounted(()=>{
  if(props.value.length===0){
    isActiveEditBtnShow.value=true
  }
})
//输入框内容
const inputContent=ref(props.value)
//提交
function submit(){

  emits('alterInfo',props.itemKey,inputContent.value)
  mode.value='view'

}
</script>

<template>
<div class="flex p-4 items-center font-bold" @mouseover="isActiveEditBtnShow=true;" @mouseleave="isActiveEditBtnShow=false">
  <div class="w-40">{{label}}</div>
  <div v-show="mode=='view'" class="flex">
    <div class="mr-2" >{{value}}</div>
    <div class="text-blue-500 flex leading-tight  items-center cursor-pointer"   @click="mode='edit'" v-show="isActiveEditBtnShow||isCreateOrUpdate==='添加'">
      <el-icon class="border-2 rounded-full border-blue-500  "><Plus></Plus></el-icon>
      <div class="ml-1">{{isCreateOrUpdate}}</div>
    </div>
  </div>
  <div v-show="mode==='edit'" class=" p-4 items-center font-bold">
    <el-input v-model="inputContent"  class="mr-2"></el-input>
    <div class="flex  w-20 mt-4">
      <el-button @click="submit" class="bg-primary mr-4 text-white">确定</el-button>
      <el-button @click="inputContent=value;mode='view'">取消</el-button>
    </div>
  </div>
</div>

</template>

<style scoped>

</style>