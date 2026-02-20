<script setup lang="ts">
import {useAppStore} from "@/stores/app.ts";
import {useAnswerStore} from "@/stores/answer.ts";
import {computed, onMounted, onUnmounted, type Ref, ref} from "vue";
import LikeRecordItem from "@/modules/post/components/LikeRecordItem.vue";
import type {Like} from "@/utils/request/types.ts";
const answerStore = useAnswerStore()
const appStore = useAppStore()
const likesRecord: Ref<Like[]> = ref([])

onMounted(async()=>{
  likesRecord.value =await answerStore.getLikesRecordByAnswerId(appStore.showLikeAnswerId as string)

})
const likesCount = computed(()=>{
  return likesRecord.value.length
})
//点赞列表节点
const likeArea = ref<HTMLDivElement | null>(null)
// 关闭点赞列表
const closeCover = (e:MouseEvent)=>{
  if(likeArea.value && !likeArea.value.contains(e.target as Node)){
    appStore.isShowCover = false
  }
  setTimeout(()=>{
    window.scrollTo({top:appStore.scrollY,behavior:'smooth'})
  },50)

}
onUnmounted(()=>{
  appStore.isShowCover = false

})
</script>

<template>
  <div class="h-screen   top-0 left-0 z-50   absolute w-full bg-black/30 " @click="closeCover" >
    <div class="rounded bg-white mx-auto top-40 relative h-80 w-[460px]" ref="likeArea">
      <header class="border-b p-2">
        {{likesCount||0}}人赞同了
      </header>
      <div class="overflow-y-auto p-2">
        <div v-for="item in likesRecord" :key="item.id" class="border-b p-2">
          <LikeRecordItem :like="item"></LikeRecordItem>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>