<script setup lang="ts">
import type { MermaidPage, MermaidUpdateAction } from '@chat-tutor/shared'
import { MermaidBlockNode } from 'markstream-vue'
import { computed, ref } from 'vue'
import { useActionStack } from '#/composables/use-action-stack'

const props = defineProps<{
  page: MermaidPage
  visible?: boolean
}>()

// Initialize content from page steps
const getInitialContent = () => {
  const steps = props.page.steps.filter(step => step.type === 'mermaid-update')
  const lastStep = steps[steps.length - 1]
  return lastStep ? (lastStep as MermaidUpdateAction).options.content : ''
}

const content = ref(getInitialContent())

// Setup action handler
const usePageActionStack = useActionStack('chat')
const { onAction } = usePageActionStack(props.page.id)

onAction((action) => {
  if (action.type === 'mermaid-update') {
    content.value = (action as MermaidUpdateAction).options.content
    return true
  }
  return false
})

const contentNode = computed(() => ({
  type: 'code_block',
  language: 'mermaid',
  code: content.value,
  raw: ''
}))
</script>

<template>
  <MermaidBlockNode
    :node="contentNode"
    max-height="100%"
    class="size-full"
  />
</template>