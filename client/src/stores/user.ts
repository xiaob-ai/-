// src/stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type {CreateFollowQuestionDto, CreateFollowUserDto, FollowUser, User} from '@/utils/request/types.ts'
import {followService, userService} from '@/utils/request/index.ts' // 你的 axios 封装
import router from '@/router'
import {ElMessage} from "element-plus";



export const useUserStore = defineStore(
    'user',
    () => {
        /* 状态 */
        const token = ref<string>('')

        //个人信息
        const profile = ref<User | null>(null)

        // 关注
        const followingUser= ref<FollowUser[]>([])
        /* 计算 */
        const isLogin = computed(() => !!token.value)
        const defaultAvartar = ref('https://picsum.photos/200/300')

        /* 动作 */
        async function login(phone: string, pwd: string) {

            const res= await userService.login(phone, pwd)
                if(res){
                    token.value = res.token as string
                    await router.replace('/')
                    ElMessage.success('登录成功')
                }
                else{
                    throw new Error('登录失败')
                }
        }
        async function followQuestion(dto: CreateFollowQuestionDto){
            const res = await followService.followQuestion(dto)
            if(res){
                ElMessage.success('关注成功!')
            }
            else{
                throw new Error('关注失败')
            }
        }
        async function cancelFollowQuestion(dto: CreateFollowQuestionDto){
            const res = await followService.cancelFollowQuestion(dto)
            if(res){
                ElMessage.success('取消关注成功!')
            }
            else{
                throw new Error('取消关注失败')
            }
        }
        async function followUser(dto: CreateFollowUserDto){
            const res = await followService.followUser(dto)
            if(res){
                ElMessage.success('关注成功!')
            }
            else{
                throw new Error('关注失败')
            }
        }
        async function cancelFollowUser(dto: CreateFollowUserDto){
            const res = await followService.cancelFollowUser(dto)
            if(res){
                ElMessage.success('取消关注成功!')
            }
            else{
                throw new Error('取消关注失败')
            }
        }
        async function getFollowing(){
            followingUser.value = await followService.getUserFollowerByUserId(profile.value?.id as string)
        }
        async function getUserInfo() {
            const res = await userService.getProfile()
            if(res && 'id' in res) {
                profile.value = res as User
            }
            else{
                throw new Error('获取用户信息失败')
            }
        }
        async function getUserById(id: string) {
            return  await userService.getUserById(id)
        }

        async function register(phone: string, pwd: string, name: string) {
            const res = await userService.register(phone, pwd, name)
            if(res){
                ElMessage.success('注册成功')
            }
            else{
                throw new Error('用户已注册')
            }
        }

        async function logout() {
            token.value = ''
            profile.value = null
            await router.replace('/login')
        }

        async function refreshToken() {
            const res = await userService.refresh()
            if( res)token.value = res.token
            else {
                await logout()
            }
        }

        /* 初始化：恢复持久化数据后校验一次 token 是否仍有效 */
        async function init() {
            if (!token.value) return
            try {
                await refreshToken()
            } catch {
                await logout() // refresh 失败即视为过期
            }
        }

        return {
            token,
            profile,
            isLogin,
            login,
            logout,
            refreshToken,
            init,
            getUserInfo,
            defaultAvartar,
            register,
            getUserById,
            followQuestion,
            cancelFollowQuestion,
            followUser,
            cancelFollowUser,
            getFollowing,followingUser
        }
    },
    {
        persist: {
            key: 'user-store',
            pick: ['token', 'profile'], // 只持久化这两个字段
        },
    }
)