<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSpinner } from '@fortawesome/free-solid-svg-icons'
import { MarkdownRender } from 'markstream-vue'

defineProps<{
  content: string
  border?: boolean
  classes: string
  images: string[]
  running: boolean
}>()
</script>

<template>
  <div
    class="text-gray-600 dark:text-gray-200 px-2 markdown flex flex-col"
    :class="{ 'border border-rounded-lg': border, [classes]: true }"
  >
    <div class="flex flex-row items-center gap-2">
      <div
        v-if="running"
        class="size-4 flex justify-center items-center animate-spin"
      >
        <FontAwesomeIcon :icon="faSpinner" />
      </div>
      <ClientOnly>
        <MarkdownRender
          :content="content"
          theme="dark"
        />
      </ClientOnly>
    </div>
    <div class="flex flex-row w-full">
      <div
        v-for="image in images"
        :key="image"
      >
        <img
          :src="image"
          alt="Image"
          class="w-20 h-20 rounded-lg object-cover"
        >
      </div>
    </div>
  </div>
</template>
