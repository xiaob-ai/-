// src/router/guard.ts
import  router  from './index';
import { useUserStore } from '@/stores/user';
import  WHITE_LIST  from './white-list';
import type { RouteLocationNormalized } from 'vue-router';


const DEFAULT_TITLE = '知乎';


/* 全局前置守卫 */
router.beforeEach(async (to, from, next) => {
    const userStore = useUserStore();

    // 0. 设置页面标题
    document.title = to.meta?.title?to.meta.title+' -知乎' : DEFAULT_TITLE;

    // 1. 白名单直接放行
    if (WHITE_LIST.includes(typeof to.name === "string" ? to.name : '')) return next();

    // 2. 无 token → 去登录
    if (!userStore.token) return next('/login?redirect=' + encodeURIComponent(to.fullPath));

    // 3. 已登录但未拉取用户信息 → 拉一次
    if (!userStore.profile) {
        try {
            await userStore.getUserInfo(); // 你的接口
        } catch {
            await userStore.logout();
            return next('/login');
        }
    }

    // 4. 权限验证（可选）
    if (to.meta?.roles ) {
        const roles = to.meta?.roles ? to.meta?.roles as string[] : [];
        if (!roles.includes(userStore.profile?.role || '')) return next('/403');
    }

    next();
});

/* 全局后置钩子 → 滚动条行为 */
router.afterEach((to: RouteLocationNormalized) => {
    // 返回顶部（可改成保存历史滚动位置）
    window.scrollTo({ left: 0, top: 0 });


});