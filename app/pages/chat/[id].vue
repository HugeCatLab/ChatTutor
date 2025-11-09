<script setup lang="ts">
import { MarkdownRender } from 'vue-renderer-markdown'

const { handleAction, board, loadPages, currentPages, page, notes } = useBoard()
const { messages, input, send, loadMessages } = useChat(handleAction)
const promptAreaRef = ref()

const route = useRoute()
const { input: initialInput } = route.query as { input: string }

const handleSend = () => {
  send()
  nextTick(() => {
    promptAreaRef.value?.blur()
  })
}

if (initialInput) {
  input.value = initialInput
  const { input: _, ...restQuery } = route.query
  navigateTo({ query: restQuery }, { replace: true })
  handleSend()
}

const id = useRoute().params.id as string

void (async () => {
  const { messages, pages } = await $fetch<{ messages: Message[], pages: Page[] }>(`/api/chat/${id}/info`)
  if (messages.length === 0) {
    return
  }
  loadMessages(messages)
  loadPages(pages)
})()

onMounted(() => {
  console.log(board.value)
})
</script>

<template>
  <div class="flex pt-10 md:pt-0 flex-col md:flex-row w-full h-full overflow-hidden">
    <div class="flex flex-1 flex-col h-full items-center justify-center overflow-hidden min-w-0 p-5 gap-2">
      <div class="flex flex-row w-full h-full gap-1">
        <div
          ref="board"
          class="h-50 md:h-130 flex justify-center"
          :class="notes.length > 0 ? 'w-2/3' : 'w-full'"
        />
        <div
          v-if="notes.length > 0"
          class="h-125 shadow-sm max-h-50 md:max-h-130 w-1/3 text-sm flex flex-col bg-gray-100 border border-gray-300 rounded-lg p-3 overflow-y-auto markdown"
        >
          <MarkdownRender :content="notes.join('\n\n')" />
        </div>
      </div>
      <div class="w-full h-20 md:h-auto max-w-screen-md justify-center flex flex-col gap-5">
        <PagesPreview
          :pages="currentPages"
          @select="(id) => page = id"
        />
      </div>
    </div>
    <div class="flex flex-col h-screen max-h-screen bg-gray-200 w-full md:w-100 p-3 shadow-lg flex-shrink-0">
      <Chat
        ref="promptAreaRef"
        v-model:input="input"
        :messages="messages"
        @send="handleSend"
        @keydown.enter="handleSend"
      />
    </div>
  </div>
</template>