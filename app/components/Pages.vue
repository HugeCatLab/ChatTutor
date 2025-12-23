<script setup lang="ts">
import { MarkdownRender } from 'markstream-vue'
import { PageType } from '@chat-tutor/shared'

const { t } = useI18n()

const props = defineProps<{
  pages: Page[]
  currentPage: string
}>()

const notes = ref<string[]>([])

const _currentPage = computed(() => props.pages.find(page => page.id === props.currentPage)!)
console.log(props)

watch(_currentPage, (page) => {
  if (!page || !page.steps) return
  notes.value.length = 0
  for (const step of page.steps) {
    if (step.type === 'note') {
      notes.value.push(step.options.content)
    }
  }
}, { immediate: true, deep: true })

const areaClasses = 'shadow-sm dark:text-gray-200 bg-gray-100 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg'
</script>

<template>
  <div class="size-full flex flex-row gap-2">
    <!-- Notes area with absolute positioning to constrain height -->
    <div class="w-2/7 h-full flex-shrink-0 relative">
      <div :class="areaClasses" class="absolute inset-0 markdown p-3 text-sm overflow-y-auto">
        <h3
          class="text-lg font-bold text-gray-500 dark:text-gray-400 mb-2 border-b border-gray-300 dark:border-gray-700 pb-2">
          {{ t('chat.notes') }}
        </h3>
        <MarkdownRender :content="notes.join('\n\n')" />
      </div>
    </div>
    <!-- Preview area -->
    <template v-for="page in pages" :key="page.id">
      <!-- Mermaid pages use v-show to preserve state -->
      <div v-if="page.type === PageType.MERMAID" v-show="page.id === currentPage" :class="areaClasses"
        class="h-full w-5/7">
        <MermaidPage :page="page" class="w-full" />
      </div>
      <!-- GGB pages use v-if because GeoGebra needs visible container to initialize -->
      <div v-if="page.type === PageType.GGB && page.id === currentPage" :class="areaClasses" class="h-full w-5/7">
        <Suspense>
          <GGBPage :page="page" class="w-full" />
        </Suspense>
      </div>
    </template>
  </div>
</template>
