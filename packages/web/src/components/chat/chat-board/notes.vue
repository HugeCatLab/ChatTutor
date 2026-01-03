<script setup lang="ts">
import type { Page } from '@chat-tutor/shared'
import PageNotes from './page-notes.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n() 

defineProps<{
  pages: Page[]
  current: string | null
}>()
</script>

<template>
  <div class="size-full flex flex-col gap-2">
    <span class="text-md font-bold text-gray-500 dark:text-gray-400 max-md:text-right max-md:pr-1">
      {{ t('chat.notes') }}
    </span>
    <div class="flex flex-col w-full overflow-y-auto">
      <div
        v-for="page in pages"
        v-show="current === page.id"
        :key="page.id"
        class="size-full"
      >
        <PageNotes :page="page" />
      </div>
    </div>
  </div>
</template>
