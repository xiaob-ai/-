<script setup lang="ts">

import {ref} from "vue";
import LoginForm from "@/modules/auth/components/LoginForm.vue";
import LoginFooter from "@/modules/auth/components/LoginFooter.vue";
import RegisterForm from "@/modules/auth/components/RegisterForm.vue";

enum Mode {
  login,
  register
}
const mode = ref(Mode.login)

const glowStyle=`drop-shadow-sm
hover:drop-shadow-[0_0_12px_rgba(var(--glow))]
hover:brightness-125
transition duration-300`
</script>

<template>
  <div class="login-container  flex items-center flex-col  justify-center ">
    <!-- 卡片容器 -->
    <el-row justify="center"  class="top-16 absolute" >
      <el-col class="text-center">
        <h1 class="text-4xl font-bold text-info">知乎</h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">有问题，就会有答案</p>
      </el-col>
    </el-row>
    <el-row justify="center"  :gutter="24" class="w-full">
      <el-col :xs="20" :lg="8" :sm="16" :md="13">
        <el-card class="w-full p-3 flex flex-col justify-around">
          <div class="text-center flex justify-around mb-10">
            <h2 class="text-2xl text-gray-500 font-bold" @click="mode=Mode.login" :class="{'text-black border-b-2 border-primary':mode===Mode.login}">登录</h2>
            <h2 class="text-2xl text-gray-500 font-bold" @click="mode=Mode.register" :class="{'text-black border-b-2 border-primary':mode===Mode.register}">注册</h2>
          </div>
          <div>
            <LoginForm v-if="mode==Mode.login">
            </LoginForm>
            <RegisterForm v-if="mode==Mode.register"></RegisterForm>
          </div>
          <div class=" border-t-2 flex justify-around p-4 w-full h-20  border-gray-500/0.5  " >
            <el-icon size="40px " class="hover:text-primary" :class="glowStyle"><ElementPlus /></el-icon>
            <el-icon size="40px" class="hover:text-primary" :class="glowStyle"><SwitchFilled /></el-icon>
            <el-icon size="40px" class="hover:text-primary" :class="glowStyle"><ChromeFilled /></el-icon>
          </div>
        </el-card>
      </el-col>

    </el-row>

  <login-footer ></login-footer>





  </div>
</template>

<style scoped>
.login-container {
  min-height: 100vh;
  background-image: url('@/assets/bg/login-bg.png');
  background-size: cover;        /* 始终铺满 */
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;  /* 滚动不抖 */
}


</style>