<script setup lang="ts">
//@ts-ignore
import AvatarEdit from "@/modules/user/components/Edit/AvatarEdit.vue";
import {nextTick, reactive, ref} from "vue";
import {useUserStore} from "@/stores/user.ts";
import InfoEditItem from "@/modules/user/components/Edit/InfoEditItem.vue";
import type {UnNecessaryInfoType} from "@/types";

const userStore = useUserStore();


// 编辑头像
const isEditAvatar = ref(false);
function closeEditAvatar() {
  isEditAvatar.value = false;
}
//编辑用户信息
const userForm=reactive({
  username: userStore.profile?.username,
  phone: userStore.profile?.phone,
  avatar: userStore.profile?.avatar,
  bio: userStore.profile?.bio,
  location: userStore.profile?.location,
  business: userStore.profile?.business,
  school: userStore.profile?.school,
  major: userStore.profile?.major,
  email: userStore.profile?.email
})
const inputContent=ref(userForm.username)
const isEdit=ref(false)
const inputEl=ref<null| HTMLInputElement>(null)
const showEdit =async () => {
  isEdit.value = true
  await nextTick()
  inputEl.value?.focus()
}
// 非必要信息列表元素
interface UnNecessaryMapItem {
  label: string;
  value: UnNecessaryInfoType;
}
// 非必要信息列表
const unnecessaryInfoListMap: UnNecessaryMapItem[] = [
  {
    label: '邮箱',
    value: 'email'
  },
  {
    label: '一句话介绍',
    value: 'bio'
  },
  {
    label: '居住地',
    value: 'location'
  },
  {
    label: '所在公司',
    value: 'business'
  },
  {
    label: '所在学校',
    value: 'school'
  },
  {
    label: '专业',
    value: 'major'
  }
]
// 设置用户信息
function setInfo(info: string, value: string) {
  userForm[info as keyof typeof userForm] = value
}
</script>

<template>
  <div class="shadow mt-2  bg-white w-[1000px] mx-auto min-h-[200px] p-2">
    <transition name="slide-down">
      <AvatarEdit  v-show="isEditAvatar" @close="closeEditAvatar"></AvatarEdit>
    </transition>
    <div class="flex mt-2">

      <div class="w-40 h-40 overflow-hidden relative  p-1 mr-2 rounded">
        <img class="w-full h-full rounded" :src="userStore.profile?.avatar" alt="">
        <div class="absolute top-0 left-0 w-full h-full bg-black/20 flex justify-center items-center text-white font-bold" @click="isEditAvatar = true">修改我的头像</div>
      </div>
      <div class="flex-1 ">
        <div class="flex w-full mb-4 justify-between">
          <div class="text-4xl font-bold" v-show="!isEdit">{{userStore.profile?.username}}<span @click="showEdit" class="ml-2 text-blue-500 text-sm cursor-pointer">修改</span></div>
          <div class="flex" v-show="isEdit" ><el-input ref="inputEl" @blur="isEdit=false" v-model="inputContent" class="w-[300px] mr-2"></el-input><el-button @click="isEdit=false" class="bg-primary text-white">修改</el-button></div>
          <div class="text-sm text-gray-500" @click="$router.push({name: 'answer'})">返回我的主页</div>
        </div>
        <div>
          <InfoEditItem @alterInfo="setInfo" v-for="item in unnecessaryInfoListMap" :itemKey="item.value as string" :key="item.value" :label="item.label" :value="userForm[item.value] || ''"></InfoEditItem>


        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.slide-down-enter-active {
  animation: slideDown 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

/* 向上滑入动画 - 离开 */
.slide-down-leave-active {
  animation: slideUp 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateY(0);
    max-height: 1000px;
  }
  to {
    opacity: 0;
    transform: translateY(-20px);
    max-height: 0;
  }
}

</style>