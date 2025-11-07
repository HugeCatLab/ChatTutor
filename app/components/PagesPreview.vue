<script setup lang="ts">
import { PageType } from '@chat-tutor/shared'

defineProps<{
  pages: Page[]
}>()

const emojiMap: Record<string, string> = {
  [PageType.CANVAS]: '🎨',
  [PageType.MERMAID]: '📈',
}

defineEmits<{
  (e: 'select', id: string): void
}>()
</script>

<template>
  <div class="flex flex-row w-full h-40 overflow-x-auto bg-gray-100 rounded-lg p-5 gap-5">
    <div
      v-for="(page, index) in pages"
      :key="page.id"
      class="flex flex-col items-center w-35 shrink-0 justify-center p-1 gap-2"
    >
      <div
        class="w-full h-full flex flex-row gap-2 justify-center items-center rounded-lg bg-white hover:bg-gray-200 transition-all duration-300 cursor-pointer select-none"
        @click="$emit('select', page.id!)"
      >
        <span class="text-lg font-bold text-gray-500">{{ index + 1 }}</span>
        {{ emojiMap[page.type as string] }}
      </div>
      <h3 class="text-sm text-gray-600">
        {{ page.title }}
      </h3>
    </div>
  </div>
</template>