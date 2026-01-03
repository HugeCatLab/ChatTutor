<script setup lang="ts">
import { Card, CardContent } from '@chat-tutor/ui'
import { PageType } from '@chat-tutor/shared'

const getIcon = (type: PageType) => {
  switch (type) {
    case PageType.MERMAID:
      return '📈'
    case PageType.GGB:
      return '🔢'
  }
}

defineProps<{
  type: PageType
  title: string
  count: number
}>()
</script>

<template>
  <div class="flex flex-col h-full gap-2">
    <Card class="h-full w-48 hover:bg-gray-100 dark:hover:bg-gray-700">
      <CardContent class="h-full select-none">
        <div class="size-full flex flex-row gap-2 items-center justify-center">
          <span class="text-2xl font-bold text-gray-500">{{ count }}</span>
          <span class="text-2xl font-bold">{{ getIcon(type) }}</span>
        </div>
      </CardContent>
    </Card>
    <span class="text-sm text-center">{{ title }}</span>
  </div>
</template>