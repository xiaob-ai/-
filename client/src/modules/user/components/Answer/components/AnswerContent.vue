<script setup lang="ts">

import CommentItem from "@/modules/common/components/CommentItem.vue";
import {computed, onBeforeMount,  ref} from "vue";
import type {Answer} from "@/utils/request/types.ts";
import {useAnswerStore} from "@/stores/answer.ts";
import type{Comment} from "@/utils/request/types.ts";
import {useUserStore} from "@/stores/user.ts";
const userStore = useUserStore()
const answerStore = useAnswerStore()
const {answerId} = defineProps({
  answerId: {
    type: String,
    required: true
  }
})
const answer = ref<Answer | null>()

const displayContent =computed(()=>{
  if(!answer.value){
    return ''
  }
  if(answer.value.content.length>80&&isCollapsed.value){
    return answer.value?.content.substring(0, 80)+'...'
  }
  return answer.value?.content
})
const isCollapsed = ref(true)
function onExtendBtnClick() {
  isCollapsed.value = false

}
function onCollapseBtnClick() {
  isCollapsed.value = true

}

onBeforeMount(async()=>{
  answer.value = await answerStore.getAnswerById(answerId)
  if(answer.value){
    comments.value = await answerStore.getCommentsByAnswerId(answer.value.id)
    let likeRes= await answerStore.isUserLike(userStore.profile!.id,answer.value.id)
    if(likeRes) {
      isLike.value = likeRes
    }
  }

})
const comments = ref<Comment[]>([])
const isCommentShow = ref(false)
const newCommentConten = ref('')
const onSubmitComment = async () => {
  if(newCommentConten.value.length<1||!answer.value){
    return
  }
  await answerStore.createComment({
    content: newCommentConten.value,
    answerId: answer.value.id,
    userId: userStore.profile!.id
  })

  newCommentConten.value = ''
  comments.value = await answerStore.getCommentsByAnswerId(answer.value.id)
}


const isLike = ref({
  like: false,
  dislike: false
})
async function like() {
  if(!answer.value){
     return
  }
  if(isLike.value.like){
    await answerStore.cancelLike({
      answerId: answer.value.id,
      userId: userStore.profile!.id,
    })
    isLike.value.like = false
    answer.value=await answerStore.getAnswerById(answer.value.id)
    return
  }
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: answer.value.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
    answer.value=await answerStore.getAnswerById(answer.value.id)
  }

  await answerStore.likeAnswer({
    answerId: answer.value!.id,
    userId: userStore.profile!.id,
    isLike: true
  })
  answer.value=await answerStore.getAnswerById(answer.value!.id)
  isLike.value.like = true
  isLike.value.dislike = false


}
async function dislike() {
  if(!answer.value){
    return
  }
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: answer.value.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
    return
  }
  if(isLike.value.like){
    await answerStore.cancelLike({
      answerId: answer.value.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
    answer.value=await answerStore.getAnswerById(answer.value.id)
  }
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: answer.value!.id,
      userId: userStore.profile!.id,
    })
  }
  await answerStore.likeAnswer({
    answerId: answer.value!.id,
    userId: userStore.profile!.id,
    isLike: false
  })
  isLike.value.dislike = true
  isLike.value.like = false

}
</script>

<template>
  <div  class=" mt-2 w-full h-1/3 hover:text-gray-500 " style="font-size: 15px">
    <span class="content-container">{{displayContent}}</span><span v-if="isCollapsed" class="cursor-pointer text-primary" @click="onExtendBtnClick">展开</span>
    <span v-else class="cursor-pointer text-primary" @click="onCollapseBtnClick">收起</span>
  </div>
  <footer class="flex h-auto mx-2 mt-2 items-center">
    <div class="bg-blue-300 p-1 rounded  cursor-pointer  'text-white'" :class="{ ' bg-primary':isLike.like}" @click="like" ><el-icon color="white"><ArrowUpBold /></el-icon> 赞同 {{answer?.voteUp || 0}}</div>
    <div class="bg-blue-300 p-1 rounded ml-2 text-primary cursor-pointer" :class="{ 'bg-primary':isLike.dislike}" @click="dislike"><el-icon color="white"><ArrowDownBold /></el-icon></div>
    <div class="ml-4 text-gray-600 cursor-pointer" v-show="!isCommentShow" @click="isCommentShow=!isCommentShow"> {{answer?.commentCount||0>0 ? answer?.commentCount+'条评论' : '添加评论'}}</div>
    <div class="ml-4 text-gray-600 cursor-pointer" v-show="isCommentShow" @click="isCommentShow=!isCommentShow">收起评论</div>


  </footer>
  <div v-show="isCommentShow " class="overflow-y-auto overflow-x-hidden min-h-500">
    <div class="flex h-10 my-2" >
      <div class="h-full mr-2"><img class="w-8 h-8 rounded-full bg-white" :src="userStore.profile?.avatar"></div>
      <el-input class="w-full" placeholder="请输入添加评论" v-model="newCommentConten" v-show="isCommentShow"></el-input>
      <el-button class="h-full ml-2" type="primary" @click="onSubmitComment">提交</el-button>

    </div>
    <div class="w-full  flex  justify-center" v-if="comments.length<1">暂无评论...</div>
    <div class="w-full  flex font-bold font-2xl border rounded p-2 mx-2" v-if="comments.length>0">{{comments.length}} 条评论</div>
    <div class="w-full border rounded p-2 mx-2">
      <div v-for="comment in comments" class="flex  w-full  my-2  ">

        <CommentItem :comment="comment"></CommentItem>
      </div>

    </div>

  </div>
</template>

<style scoped>

</style>