<script setup lang="ts">
import { useActionStack } from '#/composables/use-action-stack'
import type { NoteAppendAction, Page } from '@chat-tutor/shared'
import { MarkdownRender } from 'markstream-vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps<{
  page: Page
}>()

// Initialize content from page steps
const getInitialContent = () => {
  const steps = props.page.steps.filter(step => step.type === 'note-append')
  return steps.map(step => (step as NoteAppendAction).options.content).join('\n\n')
}

const content = ref(getInitialContent())

// Setup action handler
const usePageActionStack = useActionStack('chat')
const { onAction } = usePageActionStack(props.page.id)

onAction((action) => {
  if (action.type === 'note-append') {
    const newContent = (action as NoteAppendAction).options.content
    content.value = content.value ? `${content.value}\n\n${newContent}` : newContent
    return true
  }
  return false
})
</script>

<template>
  <div class="flex flex-col gap-2 h-full">
    <MarkdownRender
      v-if="content"
      :content="content"
    />
    <div
      v-else
      class="text-gray-400 dark:text-gray-500 text-sm italic"
    >
      {{ t('chat.noNotes') }}
    </div>
  </div>
</template>

