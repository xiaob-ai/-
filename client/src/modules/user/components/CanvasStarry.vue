<!-- StarrySky.vue -->
<template>
  <div class="sky w-full h-full">
    <div v-for="i in 200" :key="i" class="star" :style="randStyle()" />
  </div>
</template>

<script setup lang="ts">
// 随机位置 / 大小 / 闪烁延迟
const randStyle = () => ({
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  width: `${Math.random() * 2 + 1}px`,
  height: `${Math.random() * 2 + 1}px`,
  animationDelay: `${Math.random() * 3}s`,
});
</script>

<style scoped>
.sky {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at bottom, #1b2785 0%, #090a6f 100%);
  overflow: hidden;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 4px white;
  animation: twinkle 3s infinite;
}

@keyframes twinkle {
  0%   { opacity: 0.2; }
  50%  { opacity: 1; }
  100% { opacity: 0.2; }
}
</style>