<script setup lang="ts">
import type { Message, GGBMessage, SetMermaidMessage, PlanMessage } from '#shared/types'
import { messageIcons } from '../utils/message-icons'

const { message } = defineProps<{
  message: Message
}>()

const page = inject<Ref<string | null>>('page')!

const content = computed(() => {
  if (['assistant', 'user'].includes(message.type)) {
    return (message as AssistantMessage).content
  } else if (message.type === 'set-mermaid') {
    return message.running ? `Setting mermaid on ${message.page}...` : `Mermaid set on ${message.page}`
  } else if (message.type === 'note') {
    return message.running ? `Adding note to ${message.page}...` : `Note added to ${message.page}`
  } else if (message.type === 'ggb') {
    return message.running ? `Running GeoGebra script on ${message.page}...` : `GeoGebra script executed on ${message.page}`
  } else if (message.type === 'page') {
    return `Created ${message.pageType.toUpperCase()} page: ${message.page}`
  } else if (message.type === 'plan') {
    return message.running ? 'Planning...' : 'Planning completed'
  }
  return ''
})

const isMarkdown = computed(() => {
  return ['assistant', 'user'].includes(message.type)
})

const running = computed(() => {
  if (['user', 'assistant'].includes(message.type)) return false
  return message.running ?? false
})

const icon = computed(() => {
  return messageIcons[message.type]
})

// Check if message is expandable
const expandable = computed(() => {
  return ['plan', 'set-mermaid', 'ggb'].includes(message.type)
})

// Get expand content
const expandContent = computed(() => {
  if (message.type === 'plan') {
    return (message as PlanMessage).expandContent
  } else if (message.type === 'set-mermaid') {
    return (message as SetMermaidMessage).expandContent
  } else if (message.type === 'ggb') {
    return (message as GGBMessage).expandContent
  }
  return undefined
})

const expandLanguage = computed(() => {
  if (message.type === 'plan') {
    return 'txt'
  } else if (message.type === 'set-mermaid') {
    return 'mermaid'
  } else if (message.type === 'ggb') {
    return 'ggb'
  }
  return undefined
})

const handleClick = () => {
  if (['page', 'set-mermaid', 'note', 'ggb'].includes(message.type)) {
    page.value = (message as PageMessage | NoteMessage | SetMermaidMessage | GGBMessage).page
  }
}
</script>

<template>
  <MessageBox
    :content="content"
    :icon="icon"
    :running="running"
    :images="message.type === 'user' ? message.images : []"
    :clickable="['page', 'draw', 'set-mermaid', 'note', 'ggb'].includes(message.type)"
    :is-markdown="isMarkdown"
    :show-border="message.type === 'user'"
    :expandable="expandable"
    :expand-content="expandContent"
    :expand-language="expandLanguage"
    @click="handleClick"
  />
</template>
