import axios from 'axios'
import type { AxiosInstance, AxiosResponse } from 'axios'

import type{ BaseResponse } from './types'
import {importStore} from "@/utils";


/* 创建实例 */
const instance: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE, // 环境变量
    timeout: 10_000,
    headers: { 'Content-Type': 'application/json' }
})
/* 请求拦截 */
instance.interceptors.request.use(
    async(config) => {
        const { appStore,userStore } =await importStore()

        appStore.showLoading() // 全局 loading +1
        const token = userStore.token
        if (token) config.headers.Authorization = `Bearer ${token}`
        return config
    },
    async(err) => {
        const { appStore } =await importStore()
        appStore.hideLoading()
        return Promise.reject(err)
    }
)

/* 响应拦截 */
instance.interceptors.response.use(
    async(res: AxiosResponse<BaseResponse>)    => {
        const { appStore } =await importStore()
        appStore.hideLoading()
        const { code, data } = res.data
        if (code === 200) return data // 业务成功
        return new Error("请求失败")
    },
    async (err) => {
        const { appStore, userStore } =await importStore()
        appStore.hideLoading()
        if (err.response?.status === 401) {
            appStore.toast('登录已过期，请重新登录', 'error')
            await userStore.logout()
            return
        }

        const msg = err.response?.data?.message || '网络异常'
        appStore.toast(msg, 'error')
        return Promise.reject(err)
    }
)

export default instance