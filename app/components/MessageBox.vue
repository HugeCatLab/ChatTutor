<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import type { IconDefinition } from '@fortawesome/fontawesome-svg-core'
import { MarkdownRender } from 'markstream-vue'

const props = defineProps<{
  content: string
  icon?: IconDefinition | null
  images: string[]
  running: boolean
  clickable?: boolean
  isMarkdown?: boolean
  showBorder?: boolean
  expandable?: boolean
  expandContent?: string
  expandLanguage?: string 
}>()

const emit = defineEmits<{
  click: []
}>()

console.log(props.content)

const expanded = ref(false)

const toggleExpand = () => {
  expanded.value = !expanded.value
}
</script>

<template>
  <div class="flex flex-col">
    <div
      class="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2 py-1"
      :class="{
        'cursor-pointer hover:opacity-80': clickable,
        'border border-gray-300 dark:border-gray-700 rounded px-2': showBorder,
      }"
      @click="clickable && emit('click')"
    >
      <div
        v-if="icon"
        class="flex-shrink-0 w-4 h-4 flex items-center justify-center icon-container"
        :class="{
          'icon-pulse': running,
        }"
      >
        <FontAwesomeIcon :icon="icon" />
      </div>
      <div class="flex-1 min-w-0 markdown">
        <ClientOnly>
          <MarkdownRender
            v-if="isMarkdown"
            :content="content"
            theme="dark"
          />
        </ClientOnly>
      </div>
      <div
        v-if="images.length > 0"
        class="flex flex-row gap-2 flex-shrink-0"
      >
        <img
          v-for="image in images"
          :key="image"
          :src="image"
          alt="Image"
          class="w-16 h-16 rounded object-cover"
        >
      </div>
      <button
        v-if="expandable && expandContent"
        class="flex-shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        @click.stop="toggleExpand"
      >
        <FontAwesomeIcon :icon="expanded ? faChevronUp : faChevronDown" />
      </button>
    </div>
    <div
      v-if="expandable && expandContent && expanded"
      class="markdown ml-6 mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-60"
    >
      <ClientOnly>
        <MarkdownRender
          :content="`\`\`\` ${expandLanguage ?? 'txt'}\n${expandContent}\n\`\`\``"
          theme="dark"
        />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
@keyframes iconPulse {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0.3;
  }
}

.icon-container {
  transition: opacity 0.2s ease-in-out;
}

.icon-pulse {
  animation: iconPulse 1.5s ease-in-out infinite;
}
</style>
