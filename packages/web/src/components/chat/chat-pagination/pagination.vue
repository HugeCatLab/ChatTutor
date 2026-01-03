<script setup lang="ts">
import { Card, CardContent } from '@chat-tutor/ui'
import PageCard from './page-card.vue'
import type { Page } from '@chat-tutor/shared'

defineProps<{
  pages: Page[]
}>()

const emit = defineEmits<{
  (e: 'switch', id: string): void
}>()
</script>

<template>
  <Card class="size-full">
    <CardContent class="h-full">
      <div class="flex h-full flex-row gap-2 overflow-x-auto">
        <PageCard
          v-for="(page, index) in pages"
          :key="page.id"
          :type="page.type"
          :title="page.title"
          :count="index + 1"
          @click="() => emit('switch', page.id)"
        />
      </div>
    </CardContent>
  </Card>
</template>