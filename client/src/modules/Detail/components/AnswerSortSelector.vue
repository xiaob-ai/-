<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {Sort} from "@element-plus/icons-vue";


const selectorArea = ref<HTMLDivElement | null>(null)
onMounted(()=>{
  document.addEventListener('click',(e)=>{
    if(selectorArea.value && !selectorArea.value.contains(e.target as Node)){
      isActive.value = false
    }
  })


})
const emit = defineEmits(['selectChange'])
const isActive = ref(false)
const isDefault = ref(true)
watch(()=>isDefault.value,()=>{
  emit('selectChange',isDefault.value)
})
const text = computed(()=>{
  return isDefault.value?'默认排序':'按时间排序'
})

</script>

<template>
  <div ref="selectorArea" class="cursor-pointer">
    <div class=" text-gray-500 items-center  flex"   @click="isActive=!isActive" v-show="!isActive">
      {{text}}<el-icon><Sort/></el-icon>
    </div>
    <div class="shadow " onblur="isActice=false"  v-show="isActive">
      <div class="p-2 hover:bg-gray-50 hover:text-gray-500" @click="isDefault=true;isActive=false">默认排序</div>
      <div class="p-2 hover:bg-gray-50 hover:text-gray-500" @click="isDefault=false;isActive=false">按时间排序</div>
    </div>
  </div>


</template>

<style scoped>

</style>