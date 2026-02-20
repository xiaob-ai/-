import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {ElMessage} from "element-plus";

export const useAppStore = defineStore(
    'app',
    () => {
        /* 状态 */
        const isShowCover = ref(false)
        const scrollY = ref(0)
        const sidebarOpen = ref(true)          // 左侧菜单开合
        const theme = ref<'light' | 'dark'>('light') // 主题
        const loading = ref(false)             // 全局 loading 遮罩
        const msg = ref<{ type: 'success' | 'warning' | 'error' | 'info'; text: string } | null>(null)
        const showLikeAnswerId = ref<string | null>(null)
        /* 计算 */
        const isDark = computed(() => theme.value === 'dark')

        /* 动作 */
        function toggleSidebar() {
            sidebarOpen.value = !sidebarOpen.value
        }
        function setTheme(t: 'light' | 'dark') {
            theme.value = t
            // 实时同步到 <html class="dark">，方便 Tailwind 暗黑模式
            document.documentElement.classList.toggle('dark', t === 'dark')
        }
        function showLoading() {
            loading.value = true
        }
        function hideLoading() {
            loading.value = false
        }
        // 自动消失消息
        function toast(text: string, type: 'success' | 'warning' | 'error' |'info' = 'success') {
            msg.value = { type, text }
            ElMessage({
                message: text,
                type: type,
            })
        }

        /* 重置 */
        function reset() {
            sidebarOpen.value = true
            theme.value = 'light'
            loading.value = false
            msg.value = null
        }
        function hideCover(){
            isShowCover.value = false
        }

        return {
            scrollY,
            hideCover,
            sidebarOpen,
            theme,
            loading,
            msg,
            isDark,
            toggleSidebar,
            setTheme,
            showLoading,
            hideLoading,
            toast,
            reset,
            isShowCover,
            showLikeAnswerId,

        }
    }
)