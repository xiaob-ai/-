<template>
  <div class=" w-full border-b">
    <header>
      <div class="flex p-2  justify-between items-center" >
        <div class="flex items-center" @click="$router.push({name:'people',query:{id:user?.id}})">
          <div class="w-10 h-10 rounded-full overflow-hidden">
            <img :src="user?.avatar || userStore.defaultAvartar" alt="">
          </div>
          <div class="ml-2">
            <div class="text-xl">{{user?.username}}</div>
            <div class="text-xs text-gray-500">{{user?.headline}}</div>
          </div>

        </div>
        <div class=" text-white px-2 py-1 rounded cursor-pointer" :class="isFollowing?'bg-blue-200':'bg-primary'" @click="handleFollowBtn">
          {{isFollowing ? '取消关注' : '关注'}}
        </div>
      </div>
      <div class="my-4 text-sm cursor-pointer text-gray-500 mx-2" @click="handleShowLikeRecord">
        {{answer.voteUp}}个人赞同了该回答>
      </div>
    </header>
    <div class="mx-2">
      <div class="text-sm">{{answer.content}}</div>
      <div class="my-16  flex flex-col">
        <div class="bg-danger  mx-auto text-white py-1 px-2 rounded">送礼物</div>
        <div class="text-gray-500 mx-auto text-sm">还没有人送礼物，鼓励一些作者吧</div>
      </div>
    </div>
    <footer class="w-full p-2">
      <div class="text-xs text-gray-500">编辑于 {{createTime}}</div>
      <footer class="flex h-auto mx-2 mt-2 items-center">
        <div class="bg-blue-300 p-1 rounded  cursor-pointer  'text-white'" :class="{ ' bg-primary':isLike.like}" @click="like" ><el-icon color="white"><ArrowUpBold /></el-icon> 赞同 {{answer.voteUp}}</div>
        <div class="bg-blue-300 p-1 rounded ml-2 text-primary cursor-pointer" :class="{ 'bg-primary':isLike.dislike}" @click="dislike"><el-icon color="white"><ArrowDownBold /></el-icon></div>
        <div class="ml-4 text-gray-600 cursor-pointer" v-show="!isCommentShow" @click="isCommentShow=!isCommentShow"> {{answer.commentCount>0 ? answer.commentCount+'条评论' : '添加评论'}}</div>
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
    </footer>

  </div>
</template>
<script setup lang="ts">
import {computed, nextTick, onBeforeMount, onMounted, ref} from "vue";
import type {Answer, User,Comment} from "@/utils/request/types.ts";
import {useUserStore} from "@/stores/user.ts";
import {useAnswerStore} from "@/stores/answer.ts";
import CommentItem from "@/modules/common/components/CommentItem.vue";
import {useAppStore} from "@/stores/app.ts";
import type {QuestionWithTopics} from "@/types";
import {ElMessage} from "element-plus";
import {useRouter} from "vue-router";

const router = useRouter()
const appStore = useAppStore()
const answerStore = useAnswerStore()
const viewId=router.currentRoute.value.query.answerId as string
const isFollowing = ref(false)
const handleFollowBtn = async function () {
  if(userStore.profile!.id===user.value!.id){
    ElMessage.warning('不能关注自己哦')
     return
  }
  if(isFollowing.value) {
    await userStore.cancelFollowUser({
      userId: userStore.profile!.id,
      followerId: user.value!.id
    })
    isFollowing.value = false
    return
  }
  else {
    await userStore.followUser({
      followerId: user.value!.id,
      userId: userStore.profile!.id
    })
    isFollowing.value = true
    return
  }
}
onMounted(async()=>{
  await userStore.getFollowing()
  isFollowing.value = userStore.followingUser.some(item=>item.followUserId===user.value!.id)
  if(viewId){
    // 锚点跳转
    await nextTick(()=>{
      const el = document.getElementById(viewId)

      if(el){
        el.scrollIntoView()
      }
    })
  }
})

const handleShowLikeRecord = function () {
  appStore.showLikeAnswerId = props.answer.id
  appStore.scrollY = window.scrollY
  appStore.isShowCover = true
}
//格式化回答创建时间
const createTime = computed(() => {
  let date = new Date(props.answer.createdAt)
  return date.toLocaleString()
})
const isCommentShow = ref(false)
const userStore = useUserStore()
const comments = ref<Comment[]>([])
const onSubmitComment = async () => {
  if(newCommentConten.value.length<1){
    return
  }
  await answerStore.createComment({
    content: newCommentConten.value,
    answerId: props.answer.id,
    userId: userStore.profile!.id
  })

  newCommentConten.value = ''
  comments.value = await answerStore.getCommentsByAnswerId(props.answer.id)
}
// 即将上传的评论
const newCommentConten = ref('')
const isLike = ref({
  like: false,
  dislike: false
})
const props=defineProps<{
  answer: Answer,
  question: QuestionWithTopics
}>()
const user= ref<User|null>(null)
onBeforeMount(async()=>{
  user.value =await userStore.getUserById(props.answer.authorId)
  // 判断用户是否点赞
  const isLikeRes = await answerStore.isUserLike(userStore.profile!.id,props.answer.id)
  if(isLikeRes) {
    isLike.value= isLikeRes
  }
  comments.value= await answerStore.getCommentsByAnswerId(props.answer.id)



})
//赞同
async function like() {
  if(isLike.value.like){
    await answerStore.cancelLike({
      answerId: props.answer.id,
      userId: userStore.profile!.id,
    })
    isLike.value.like = false
    props.answer.voteUp--
    return
  }
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: props.answer.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
  }

  await answerStore.likeAnswer({
    answerId: props.answer.id,
    userId: userStore.profile!.id,
    isLike: true
  })
  props.answer.voteUp++
  isLike.value.like = true
  isLike.value.dislike = false


}
//反对
async function dislike() {
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: props.answer.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
    return
  }
  if(isLike.value.like){
    await answerStore.cancelLike({
      answerId: props.answer.id,
      userId: userStore.profile!.id,
    })
    isLike.value.dislike = false
    props.answer.voteUp--

  }
  if(isLike.value.dislike){
    await answerStore.cancelLike({
      answerId: props.answer.id,
      userId: userStore.profile!.id,
    })
  }
  await answerStore.likeAnswer({
    answerId: props.answer.id,
    userId: userStore.profile!.id,
    isLike: false
  })

  isLike.value.dislike = true
  isLike.value.like = false

}
</script>