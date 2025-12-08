<script setup lang="ts">
import type { Message } from '#shared/types'

const { message } = defineProps<{
  message: Message
}>()

const page = inject<Ref<string | null>>('page')!

const content = computed(() => {
  if (['assistant', 'user'].includes(message.type)) {
    return (<AssistantMessage>message).content
  } else if (message.type === 'draw') {
    return `Painted on **${message.page}**`
  } else if (message.type === 'set-mermaid') {
    return `Set mermaid on **${message.page}**`
  } else if (message.type === 'note') {
    return `Note on **${message.page}**`
  } else if (message.type === 'page') {
    return `Created a **${emojiMap[message.pageType]}${message.pageType.toUpperCase()}** page`
  }
  return ''
})

const running = computed(() => {
  if (['user', 'assistant'].includes(message.type)) return false
  return message.running ?? false
})

const handleClick = () => {
  if (['page', 'draw', 'set-mermaid', 'note'].includes(message.type)) {
    page.value = (message as PageMessage).page
  }
}

const classes = computed(() => {
  const text = ' font-mono text-gray-100 flex items-center justify-center cursor-pointer hover:opacity-60 select-none'
  if (message.type === 'user') return 'border-gray-300 dark:border-gray-700 border'
  if (message.type === 'draw') return 'border-2 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-950' + text
  if (message.type === 'set-mermaid') return 'border-2 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950' + text
  if (message.type === 'note') return 'border-2 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-950' + text
  if (message.type === 'page') return 'border-2 border-purple-200 dark:border-purple-800 bg-purple-50 dark:bg-purple-950' + text
  return ''
})
</script>

<template>
  <MessageBox
    :content="content"
    :border="message.type !== 'assistant'"
    :classes="classes"
    :running="running"
    :images="message.type === 'user' ? message.images : []"
    @click="handleClick"
  />
</template>
