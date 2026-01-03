<script setup lang="ts">
import type { UserClientMessage } from '@chat-tutor/shared'
import { MarkdownRender } from 'markstream-vue'

defineProps<{
  message: UserClientMessage
}>()
</script>

<template>
  <div class="flex flex-col">
    <div
      class="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2 py-1 border border-gray-300 dark:border-gray-700 rounded px-2"
    >
      <div class="flex-1 min-w-0 markdown">
        <ClientOnly>
          <MarkdownRender
            :content="message.content"
            theme="dark"
          />
        </ClientOnly>
      </div>
    </div>
  </div>
</template>

<style scoped>
.markdown {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>

