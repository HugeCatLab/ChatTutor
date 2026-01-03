<script setup lang="ts">
import { PageType, type Page } from '@chat-tutor/shared'
import MermaidPage from './mermaid-page.vue'
import GGBPage from './ggb-page.vue'

defineProps<{
  current: string | null
  pages: Page[]
}>()
</script>

<template>
  <div class="relative size-full">
    <div
      v-for="page in pages"
      :key="page.id"
      class="absolute inset-0"
    >
      <MermaidPage
        v-if="page.type === PageType.MERMAID"
        v-show="current === page.id"
        :page="page"
        :visible="current === page.id"
      />
      <GGBPage
        v-if="page.type === PageType.GGB"
        v-show="current === page.id"
        :page="page"
        :visible="current === page.id"
      />
    </div>
  </div>
</template>
