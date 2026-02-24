<script setup lang="ts">
import type {Question} from "@/utils/request/types.ts";

const props = defineProps<{
  question:Question
}>()

</script>

<template>
  <div class="p-2" @click="$router.push('/detail/'+question.id)">
    <header class="font-bold hover:text-primary " >{{props.question.title}}</header>
    <main class="text-gray-500 text-sm">
      {{new Date(question.createdAt).toLocaleString()}} · {{question.answerCount}}个回答 · {{question.followerCount}}个关注
    </main>
  </div>
</template>

<style scoped>

</style>