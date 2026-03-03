<script setup lang="ts">
//@ts-ignore
import AvatarEdit from "@/modules/user/components/Edit/AvatarEdit.vue";
import {ref} from "vue";
import {useUserStore} from "@/stores/user.ts";

const userStore = useUserStore();


// 编辑头像
const isEditAvatar = ref(false);
function closeEditAvatar() {
  isEditAvatar.value = false;
}
//编辑用户信息
const userForm=ref({
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

</script>

<template>
  <div class="shadow mt-2  bg-white w-[1000px] mx-auto min-h-[200px] p-2">
    <transition name="slide-down">
      <AvatarEdit  v-if="isEditAvatar" @close="closeEditAvatar"></AvatarEdit>
    </transition>
    <div class="flex mt-2">

      <div class="w-40 h-40 overflow-hidden relative  p-1 mr-2 rounded">
        <img class="w-full h-full rounded" :src="userStore.profile?.avatar" alt="">
        <div class="absolute top-0 left-0 w-full h-full bg-black/20 flex justify-center items-center text-white font-bold" @click="isEditAvatar = true">修改我的头像</div>
      </div>
      <div class="flex-1 ">
        <div class="flex w-full mb-4 justify-between">
          <div class="text-4xl font-bold">{{userStore.profile?.username}}<span class="ml-2 text-blue-500 text-sm">修改</span></div>
          <div class="text-sm text-gray-500" @click="$router.push({name: 'answer'})">返回我的主页</div>
        </div>
        <div>
          <div class=" py-4 border-b w-full flex">
            <div class="w-60 font-bold">一句话介绍</div>
          </div>
          <div class=" py-4 border-b w-full flex"></div>
          <div class=" py-4 border-b w-full flex "></div>
          <div class=" py-4 border-b w-full flex"></div>
          <div class=" py-4 border-b w-full flex"></div>

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