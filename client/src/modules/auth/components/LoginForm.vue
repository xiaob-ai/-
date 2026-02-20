<script setup lang="ts">
import {useUserStore} from "@/stores/user.ts";
import {reactive, ref} from "vue";
import {validatePassword,validatePhone} from "@/utils";
import {useAppStore} from "@/stores/app.ts";
import type {FormInstance} from "element-plus";
const formRef = ref<FormInstance>();
const userStore=useUserStore()
const appStore=useAppStore()
const form =reactive( {
  phone:'',
  password:''
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
  ]
}

const onSubmit= (formEl :FormInstance)=>{
  if(!formEl) return
  formEl.validate((valid=>{
    if(valid){
      userStore.login(form.phone,form.password)
    }
  }))
}

</script>

<template>
  <el-form ref="formRef" :rules="rules" :model="form" label-width="auto"  status-icon>
    <el-form-item label="手机号" prop="phone">
      <el-input placeholder="请输入手机号" type="tel" v-model="form.phone" ></el-input>
    </el-form-item>
    <el-form-item label="密码" prop="password">
      <el-input placeholder="请输入密码" type="password" v-model="form.password"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button class="w-full" type="primary" @click="onSubmit(formRef)" :disabled="appStore.loading">{{appStore.loading?'登录中...':'登录'}}</el-button>
    </el-form-item>
  </el-form>
</template>

<style scoped>

</style>