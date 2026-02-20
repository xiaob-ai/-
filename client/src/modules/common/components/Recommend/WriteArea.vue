<script setup lang="ts">
import { reactive,ref } from 'vue'
import {CommentPermission} from "@/types";
import {useTopicStore} from "@/stores/topic";
import {ElMessage} from "element-plus";
import PostRouteList from "@/router/modules/postRouteList.ts";
const topicStore = useTopicStore()

const topicform = reactive<{name:string,description:string}>({name:'',description:''})
const options = [
  {
    value: CommentPermission.public,
    label: '任何人都可以评论'
  },
  {
    value: CommentPermission.onlyChoose,
    label: '仅显示我筛选后的评论'
  },
  {
    value: CommentPermission.onlyLikeMe,
    label: '关注我3天及以上的人能评论'
  },
    {
    value: CommentPermission.disable,
    label: '不允许评论'
  },
]
const commentPermission = ref(CommentPermission.public)

function submitHandeler() {
  if(topicform.name.trim() === ''){
    ElMessage.error('请填写话题名称')
    return
  }
  let topic = {} as any
  topic.name = topicform.name
  if(topicform.description.trim() !== '') topic.description = topicform.description
  topicStore.createTopic(topicform)


}
</script>

<template>
  <el-card class="w-full   my-3">
    <div class="flex border-b p-2">
      <div class="w-auto mr-2">
        <div class="bg-primary rounded w-8 h-8">
          <img src="../../../../assets/vue.svg">
        </div>
      </div>
      <div class="flex-1 ">
        <el-input placeholder="添加话题名称"  v-model="topicform.name" maxlength="20"  class="mb-3  no-border w-full" show-word-limit>
        </el-input>
          <el-input class="h-[90px] resize-none w-full no-border" resize="none" v-model="topicform.description" type="textarea" placeholder="描述此话题...">
          </el-input>
        <div class="flex justify-end " >
          <el-select style="width: 170px" class="no-border" v-model="commentPermission" placeholder="评论权限" >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
          </el-select>
          <el-button type="primary" class="ml-2" @click="submitHandeler">发布</el-button>
        </div>
      </div>
    </div>
    <div class="p-2">
      <div class="flex h-12 justify-around">
        <div v-for="{meta,name} in PostRouteList" :key="name" class="w-1/4 text-xl flex items-center justify-center">
          <router-link :to="{name:name}" class="w-full h-full flex items-center  justify-center">
            <el-icon :color="meta.iconColor" class="w-8 h-8">
              <component :is="meta.icon"></component>
            </el-icon>
            <div class="text-xl">{{meta.title}}</div>
          </router-link>
        </div>
      </div>
    </div>
  </el-card>
</template>

<style scoped>
.no-border {
  --el-input-border-color: transparent;
  --el-input-hover-border-color: transparent;
  --el-input-focus-border-color: transparent;
  box-shadow: none !important;
  --el-select-border-color: transparent;
  --el-select-hover-border-color: transparent;
  --el-select-focus-border-color: transparent;
}
</style>