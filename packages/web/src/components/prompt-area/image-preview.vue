<script setup lang="ts">
import { Button } from '@chat-tutor/ui'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

interface Props {
  url: string
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'remove'): void
}>()
</script>

<template>
  <div class="relative size-20 flex-shrink-0 group rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 shadow-sm">
    <img
      :src="url"
      alt="Upload preview"
      class="size-full object-cover"
    >
    <Button
      variant="ghost"
      size="icon-sm"
      class="absolute top-1 right-1 size-5 rounded-full bg-black/50 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity p-0"
      @click="emits('remove')"
    >
      <FontAwesomeIcon
        :icon="faXmark"
        class="size-3 text-white"
      />
    </Button>
  </div>
</template>

