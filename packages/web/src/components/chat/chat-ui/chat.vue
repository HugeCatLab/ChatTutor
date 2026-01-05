<script setup lang="ts">
import { PromptArea } from '#/components/prompt-area'
import { type ClientMessage, type Resource } from '@chat-tutor/shared'
import Messages from './messages.vue'
import { ref, watch, nextTick, onMounted, onUnmounted } from 'vue'

defineProps<{
  running?: boolean
}>()

const input = ref('')
const resources = ref<Resource[]>([])
const messages = defineModel<ClientMessage[]>('messages', { default: [] })

const chatContainerRef = ref<HTMLDivElement | null>(null)
const promptAreaRef = ref()
const isUserScrolling = ref(false)
let scrollTimeout: NodeJS.Timeout | null = null

const emit = defineEmits<{
  send: [input: string, resources: Resource[]]
  stop: []
}>()

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

const handleSend = () => {
  if (input.value.trim()) {
    emit('send', input.value, resources.value)
    input.value = ''
    resources.value = []
  }
}

watch(() => messages.value, () => {
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
  <div class="flex flex-col h-full w-full overflow-hidden">
    <div
      ref="chatContainerRef"
      class="w-full flex-1 min-h-0 overflow-y-auto p-2"
      @scroll="handleScroll"
    >
      <div class="flex flex-col gap-2">
        <Messages v-model:messages="messages" />
      </div>
    </div>
    <div
      class="max-md:fixed max-md:bottom-0 max-md:left-0 max-md:bg-background w-full p-2 flex-shrink-0"
    >
      <PromptArea
        ref="promptAreaRef"
        v-model:input="input"
        v-model:resources="resources"
        :running="running"
        @send="handleSend"
        @stop="$emit('stop')"
      />
    </div>
  </div>
</template>

