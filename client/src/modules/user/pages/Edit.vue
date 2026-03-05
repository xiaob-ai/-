<script setup lang="ts">
//@ts-ignore
import AvatarEdit from "@/modules/user/components/Edit/AvatarEdit.vue";
import {nextTick, reactive, ref} from "vue";
import {useUserStore} from "@/stores/user.ts";
import InfoEditItem from "@/modules/user/components/Edit/InfoEditItem.vue";
import type {UnNecessaryInfoType,AvatarItem} from "@/types";
import {ElMessage} from "element-plus";
import type {UpdateUserDto} from "@/utils/request/types.ts";

const userStore = useUserStore();


// 编辑头像
const isEditAvatar = ref(false);
function closeEditAvatar() {
  isEditAvatar.value = false;
}
//编辑用户信息
const userForm=reactive({
  id: userStore.profile?.id,
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
// 设置头像
function setAvatar(avatar: AvatarItem) {
  userForm.avatar = avatar.url
}
// 校验userForm各类信息是否符合格式
function validateInfo() {
  if(!userForm.id){
    return ElMessage.error('请先登录！')
  }
  //校验用户名
  if(!userForm.username){
    ElMessage.error('用户名不能为空')
    return false
  }
  if (userForm.username.length < 2 || userForm.username.length > 10) {
    ElMessage.error('用户名长度在2-10个字符之间')
    return false
  }
  //校验邮箱
  if (userForm.email && !/^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(userForm.email)) {
    ElMessage.error('邮箱格式不正确')
  }
  //校验学校
  if (userForm.school && (userForm.school.length < 2 || userForm.school.length > 10)) {
    ElMessage.error('学校长度在2-10个字符之间')
  }
  //校验专业
  if (userForm.major && (userForm.major.length < 2 || userForm.major.length > 10)) {
    ElMessage.error('专业长度在2-10个字符之间')
  }
  //校验头像
  if (!userForm.avatar) {
    ElMessage.error('请选择头像')
  }
  // 校验公司
  if (userForm.business && (userForm.business.length < 2 || userForm.business.length > 10)) {
    ElMessage.error('公司长度在2-10个字符之间')
  }
  // 校验居住地
  if (userForm.location && (userForm.location.length < 2 || userForm.location.length > 10)) {
    ElMessage.error('居住地长度在2-10个字符之间')
  }
  return true
}
// 提交用户信息
async function submit() {
  if (!validateInfo()) return
  else {
     await userStore.updateUserInfo(userForm as  UpdateUserDto)
  }
}
</script>

<template>
  <div class="shadow mt-2  bg-white w-[1000px] mx-auto min-h-[200px] p-2">
    <transition name="slide-down">
      <AvatarEdit  v-show="isEditAvatar" @close="closeEditAvatar"  @select="setAvatar"></AvatarEdit>
    </transition>
    <div class="flex mt-2 pb-20">

      <div class="w-40 h-40 overflow-hidden relative  p-1 mr-2 rounded">
        <img class="w-full h-full rounded" :src="userForm.avatar" alt="">
        <div class="absolute top-0 left-0 w-full h-full bg-black/20 flex justify-center items-center text-white font-bold" @click="isEditAvatar = true">修改我的头像</div>
      </div>
      <div class="flex-1 ">
        <div class="flex w-full mb-4 justify-between">
          <div class="text-4xl font-bold" v-show="!isEdit">{{userForm.username}}<span @click="showEdit" class="ml-2 text-blue-500 text-sm cursor-pointer">修改</span></div>
          <div class="flex" v-show="isEdit" ><el-input ref="inputEl" @blur="userForm.username=inputContent;isEdit=false" v-model="inputContent" class="w-[300px] mr-2"></el-input></div>
          <div class="text-sm text-gray-500" @click="$router.push({name: 'answer'})">返回我的主页</div>
        </div>
        <div>
          <InfoEditItem @alterInfo="setInfo" v-for="item in unnecessaryInfoListMap" :itemKey="item.value as string" :key="item.value" :label="item.label" :value="userForm[item.value] || ''"></InfoEditItem>


        </div>
        <div class="mt-4 w-1/2">
          <el-button @click="submit" class="w-full bg-primary text-white">提交</el-button>
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