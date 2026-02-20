<script setup lang="ts">
import {useQuestionStore} from "@/stores/qusetion.ts";

const questionStore = useQuestionStore()
const tabs = [
  { key: 'new', label: '最新问题' },
  { key: 'topic', label: '相关话题' },
] as const


</script>

<template>
  <aside class="lg:col-span-3">
    <div class="sticky top-5 rounded-xl bg-white p-4 shadow-sm">
      <h2 class="text-base font-semibold text-gray-900">问题分类</h2>
      <nav class="mt-3 space-y-1">
        <button
            v-for="t in tabs"
            :key="t.key"
            @click="questionStore.tab = t.key"
            :class="[
                  'w-full rounded-lg px-3 py-2 text-left text-sm',
                  questionStore.tab === t.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                ]"
        >
          {{ t.label }}
        </button>
      </nav>
    </div>
  </aside>
</template>

<style scoped>

</style>