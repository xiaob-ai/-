<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-neutral-900 px-4">
    <div class="max-w-2xl text-center">
      <!-- 大数字 -->
      <h1 class="text-9xl font-bold text-blue-600 dark:text-blue-400 drop-shadow-md">404</h1>

      <!-- 标题 -->
      <p class="mt-4 text-2xl text-gray-800 dark:text-gray-100">找不到页面</p>

      <!-- 副标题 -->
      <p class="mt-2 text-gray-500 dark:text-gray-400">
        你访问的地址好像跑到了没有知识的荒原…
      </p>

      <!-- 返回按钮 -->
      <div class="mt-8 space-x-3">
        <button
            @click="$router.back()"
            class="rounded-full border border-gray-300 dark:border-gray-600 px-6 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-neutral-800 transition"
        >
          返回上一页
        </button>
        <RouterLink
            to="/"
            class="rounded-full bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 transition"
        >
          回首页
        </RouterLink>
      </div>

      <!-- 底部小字 -->
      <p class="mt-12 text-xs text-gray-400 dark:text-gray-500">
        京ICP备12345678号 · 京公网安备11010802012345号
        <br />
        ©2025 知乎
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 可注入一些统计 or 自动跳转逻辑
</script>