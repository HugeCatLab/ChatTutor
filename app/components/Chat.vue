<script setup lang="ts">
import { MarkdownRender } from 'vue-renderer-markdown'
import type { Message } from '#shared/types'

const props = defineProps<{
  messages: Message[]
}>()

const input = defineModel<string>('input', { required: true })
const chatContainerRef = ref<HTMLDivElement | null>(null)
const promptAreaRef = ref()
const isUserScrolling = ref(false)
let scrollTimeout: NodeJS.Timeout | null = null

const blur = () => {
  promptAreaRef.value?.blur()
}

defineExpose({
  blur
})

const isAtBottom = () => {
  if (!chatContainerRef.value) return true
  const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.value
  return scrollHeight - scrollTop - clientHeight < 50
}

const scrollToBottom = () => {
  if (!chatContainerRef.value || isUserScrolling.value) return
  chatContainerRef.value.scrollTo({
    top: chatContainerRef.value.scrollHeight,
    behavior: 'smooth'
  })
}

const handleScroll = () => {
  if (!chatContainerRef.value) return

  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }

  const atBottom = isAtBottom()

  if (!atBottom) {
    isUserScrolling.value = true
  }

  scrollTimeout = setTimeout(() => {
    if (isAtBottom()) {
      isUserScrolling.value = false
    }
  }, 150)
}

watch(() => props.messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, { deep: true })

onMounted(() => {
  scrollToBottom()
})

onUnmounted(() => {
  if (scrollTimeout) {
    clearTimeout(scrollTimeout)
  }
})
</script>

<template>
  <div class="flex flex-col size-full">
    <div
      ref="chatContainerRef"
      class="w-full h-full flex flex-col gap-2 overflow-y-auto"
      @scroll="handleScroll"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="text-gray-600 px-2 markdown"
        :class="{
          'border-gray-300 border border-rounded-lg': message.type === 'user',
        }"
      >
        <ClientOnly>
          <MarkdownRender :content="message.content" />
        </ClientOnly>
      </div>
    </div>
    <div class="w-full fixed bottom-0 left-0 right-0 p-2 h-15 md:w-full md:relative md:h-50">
      <PromptArea
        ref="promptAreaRef"
        v-model:input="input"
      />
    </div>
  </div>
</template>
