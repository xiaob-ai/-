<script setup lang="ts">
import WriteArea from "@/modules/common/components/Recommend/WriteArea.vue";
import ContentArea from "@/modules/common/components/Recommend/ContentArea.vue";
import CreatorEntrance from "@/modules/common/components/Recommend/CreatorEntrance.vue";
import HotSearch from "@/modules/common/components/Recommend/HotSearch.vue";
import RecommendLike from "@/modules/common/components/Recommend/RecommendLike.vue";
import RightMenu from "@/modules/common/components/Recommend/RightMenu.vue";

</script>

<template>

  <div class="w-[var(--main-width)] min-h-40 flex" >
      <main class=" w-[var(--left-width)] mr-3">
        <WriteArea></WriteArea>
        <content-area></content-area>
      </main>
      <aside class="w-[var(--right-width)]">
        <Creator-Entrance></Creator-Entrance>
        <Hot-Search></Hot-Search>

      </aside>
  </div>

</template>

<style scoped>

</style>