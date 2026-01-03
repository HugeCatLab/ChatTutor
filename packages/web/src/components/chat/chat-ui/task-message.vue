<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import type { ClientMessage, PageCreateClientMessage, ErrorClientMessage } from '@chat-tutor/shared'
import { MarkdownRender } from 'markstream-vue'
import { messageIcons } from './message-icons'
import { computed, ref, inject, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{
  message: ClientMessage
}>()

const emit = defineEmits<{
  click: []
}>()

const { t } = useI18n()

// Page context for navigation
const page = inject<Ref<string | null>>('page', ref(null))

const expanded = ref(false)

// Get icon for the message type
const icon = computed(() => {
  return messageIcons[props.message.type]
})

// Check if message has content that can be expanded
const hasExpandableContent = computed(() => {
  return ['plan', 'note', 'mermaid', 'ggb'].includes(props.message.type) &&
    'content' in props.message &&
    props.message.content
})

// Get the display content for the message
const displayContent = computed(() => {
  const msg = props.message
  
  if (msg.type === 'page-create') {
    const pageMsg = msg as PageCreateClientMessage
    return t('message.types.page.created', { title: pageMsg.title || pageMsg.page })
  } else if (msg.type === 'plan') {
    return msg.running ? t('message.types.plan.running') : t('message.types.plan.completed')
  } else if (msg.type === 'note') {
    return msg.running ? t('message.types.note.running') : t('message.types.note.completed')
  } else if (msg.type === 'mermaid') {
    return msg.running ? t('message.types.mermaid.running') : t('message.types.mermaid.completed')
  } else if (msg.type === 'ggb') {
    return msg.running ? t('message.types.ggb.running') : t('message.types.ggb.completed')
  } else if (msg.type === 'error') {
    const errorMsg = msg as ErrorClientMessage
    return t('message.types.error.prefix', { message: errorMsg.error })
  }
  
  return ''
})

// Check if message is currently running
const isRunning = computed(() => {
  return 'running' in props.message && props.message.running
})

// Check if message is clickable (for navigation)
const isClickable = computed(() => {
  return ['page-create', 'note', 'mermaid', 'ggb'].includes(props.message.type)
})

// Get expand language for syntax highlighting
const expandLanguage = computed(() => {
  if (props.message.type === 'plan') {
    return 'txt'
  } else if (props.message.type === 'mermaid') {
    return 'mermaid'
  } else if (props.message.type === 'ggb') {
    return 'javascript'
  } else if (props.message.type === 'note') {
    return 'markdown'
  }
  return 'txt'
})

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const handleClick = () => {
  if (isClickable.value) {
    const msg = props.message as PageCreateClientMessage
    if ('page' in msg && page) {
      page.value = msg.page
    }
    emit('click')
  }
}
</script>

<template>
  <div class="flex flex-col">
    <div
      class="text-gray-600 dark:text-gray-300 text-sm flex items-center gap-2 py-1"
      :class="{
        'cursor-pointer hover:opacity-80': isClickable,
      }"
      @click="handleClick"
    >
      <div
        v-if="icon"
        class="shrink-0 w-4 h-4 flex items-center justify-center icon-container"
        :class="{
          'icon-pulse': isRunning,
        }"
      >
        <FontAwesomeIcon :icon="icon" />
      </div>
      <div class="flex-1 min-w-0">
        <span>{{ displayContent }}</span>
      </div>
      <button
        v-if="hasExpandableContent"
        class="shrink-0 w-5 h-5 flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        @click.stop="toggleExpand"
      >
        <FontAwesomeIcon :icon="expanded ? faChevronUp : faChevronDown" />
      </button>
    </div>
    <div
      v-if="hasExpandableContent && expanded"
      class="markdown ml-6 mt-1 p-2 bg-gray-100 dark:bg-gray-800 rounded text-xs text-gray-600 dark:text-gray-300 overflow-auto max-h-60"
    >
      <ClientOnly>
        <MarkdownRender
          v-if="'content' in message"
          :content="`\`\`\`${expandLanguage}\n${message.content}\n\`\`\``"
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

.markdown {
  word-wrap: break-word;
  overflow-wrap: break-word;
}
</style>

