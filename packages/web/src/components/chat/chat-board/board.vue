<script setup lang="ts">
import { Card, CardContent, Separator } from '@chat-tutor/ui'
import Notes from './notes.vue'
import BoardPage from './page.vue'
import type { Page } from '@chat-tutor/shared'

const props = defineProps<{
  pages: Page[]
  current: string | null
}>()

console.log(props)
</script>

<template>
  <Card class="size-full">
    <CardContent class="size-full max-md:px-2">
      <div class="size-full flex flex-row gap-2">
        <div class="flex flex-col w-1/4">
          <Notes
            :pages="pages"
            :current="current"
          />
        </div>
        <Separator orientation="vertical" />
        <div class="flex flex-col w-3/4">
          <BoardPage
            :pages="pages"
            :current="current"
          />
        </div>
      </div>
    </CardContent>
  </Card>
</template>