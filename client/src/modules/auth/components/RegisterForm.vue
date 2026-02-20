<script setup lang="ts">

import {reactive, ref} from "vue";
import {validatePassword,validatePhone,validateUsername} from "@/utils";
import {useUserStore} from "@/stores/user.ts";
import {useAppStore} from "@/stores/app.ts";
import type {FormInstance} from "element-plus";
const formRef = ref<FormInstance>();
const appStore = useAppStore();
const userStore = useUserStore();
const form =reactive( {
  phone:'',
  password:'',
  username:'',
  confirmPassword:''

})

const rules={
  phone:[
    {trigger:'blur',
      validator:validatePhone
    }
  ]
  ,
  password:[
    {trigger:'blur',validator:validatePassword}
  ],
  username:[
    {
      trigger:'blur',
      validator:validateUsername
    }
  ],
  confirmPassword:[
    {
      trigger:'blur',
      validator:validateConfirmPassword
    }
  ]

}

//校验确认密码
function validateConfirmPassword(rule: any,value:any,callback: any){
  if(!rule)return
  if(value==''){
    callback(new Error('密码不能为空！'))
  }
  else if(value!=form.password){
    callback(new Error("两次密码必须相同！"))
  }

  callback()
}

const handleRegister=(formEl :FormInstance)=>{
  if(!formEl) return
  formEl.validate((valid=>{
    if(valid){
      userStore.register(form.phone,form.password,form.username)
    }
  }))
}
</script>

<template>
  <el-form :rules="rules" :model="form" label-width="auto"  ref="formRef" status-icon>
    <el-form-item label="手机号" prop="phone">
      <el-input placeholder="请输入手机号" type="tel" v-model="form.phone" ></el-input>
    </el-form-item>
    <el-form-item label="用户名" prop="username">
      <el-input placeholder="请输入用户名" type="text" v-model="form.username"></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input placeholder="请确认密码" type="password" v-model="form.confirmPassword"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" type="primary" @click="handleRegister(formRef)" :disabled="appStore.loading" >{{appStore.loading?'注册中...':'注册'}}</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>