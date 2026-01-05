<script setup lang="ts">
import { ref } from 'vue'
import { Button, Spinner, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Kbd, KbdGroup } from '@chat-tutor/ui'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faImage, faStop } from '@fortawesome/free-solid-svg-icons'
import type { PromptAreaProps, PromptAreaEmits } from './types'
import type { Resource } from '@chat-tutor/shared'
import ImagePreview from './image-preview.vue'
import { useI18n } from 'vue-i18n'
import { client } from '#/utils/client'

const { t } = useI18n()

const props = withDefaults(defineProps<PromptAreaProps>(), {
  running: false
})

const emits = defineEmits<PromptAreaEmits>()

const input = defineModel<string>('input', { required: true, default: '' })
const resources = defineModel<Resource[]>('resources', { required: true, default: () => [] })

const textareaRef = ref<HTMLTextAreaElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)
const uploading = ref(false)
const isDragging = ref(false)

// Focus and blur methods
const blur = () => {
  textareaRef.value?.blur()
}

const focus = () => {
  textareaRef.value?.focus()
}

// Send message
const sendUserInput = () => {
  if (props.running) {
    emits('stop')
    return
  }
  if (input.value.trim() === '' && resources.value.length === 0) return

  blur()
  emits('send', input.value, resources.value)
  input.value = ''
  resources.value = []
}

// Keyboard shortcut (Cmd/Ctrl + Enter)
const handleKeyDown = (event: KeyboardEvent) => {
  if (props.running) return
  if (input.value.trim() === '' && resources.value.length === 0) return

  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    sendUserInput()
  }
}

// File upload handling
const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    console.error('Only image files are allowed')
    return
  }

  uploading.value = true
  try {
    const { data, error } = await client.resource.image.post({
      file,
    })

    if (error || !data) {
      throw new Error(error?.message || 'Upload failed')
    }

    resources.value.push({
      type: 'image',
      url: data.url,
      id: data.key, // Use the S3 key as the unique ID
    })
  } catch (error) {
    console.error('Failed to upload file:', error)
  } finally {
    uploading.value = false
  }
}

// Paste handling
const handlePaste = async (event: ClipboardEvent) => {
  const items = event.clipboardData?.items
  if (!items) return

  for (let i = 0; i < items.length; i++) {
    const item = items[i]
    if (item && item.type.startsWith('image/')) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        await uploadFile(file)
      }
    }
  }
}

// Drag and drop handling
const handleDragOver = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = true
}

const handleDragLeave = (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false
}

const handleDrop = async (event: DragEvent) => {
  event.preventDefault()
  isDragging.value = false

  const files = event.dataTransfer?.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file)
    }
  }
}

// Image button click
const handleImageButtonClick = () => {
  fileInputRef.value?.click()
}

// File select handling
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (!files) return

  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    if (file) {
      await uploadFile(file)
    }
  }

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

// Remove resource
const removeResource = (id: string) => {
  resources.value = resources.value.filter(r => r.id !== id)
}

defineExpose({
  blur,
  focus
})
</script>

<template>
  <div
    class="w-full min-h-[120px] bg-gray-50 dark:bg-gray-800 p-3 rounded-2xl flex flex-col border transition-all"
    :class="isDragging ? 'border-blue-500 border-2 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @paste="handlePaste"
  >
    <!-- Textarea -->
    <textarea
      ref="textareaRef"
      v-model="input"
      :placeholder="t('chat.placeholder')"
      class="m-2 min-h-[40px] max-h-[200px] w-full bg-transparent outline-none resize-none text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500"
      @keydown="handleKeyDown"
    />

    <!-- Image previews -->
    <div
      v-if="resources.length > 0"
      class="flex flex-row items-center w-full gap-2 px-2 pb-2 overflow-x-auto flex-shrink-0"
    >
      <ImagePreview
        v-for="resource in resources"
        :key="resource.id"
        :url="resource.url"
        @remove="removeResource(resource.id)"
      />
    </div>

    <!-- Action buttons -->
    <div class="flex flex-row items-center justify-between w-full gap-2 px-2 pb-2 flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <!-- Image upload button -->
            <Button
              variant="ghost"
              size="icon-sm"
              :disabled="uploading || running"
              @click="handleImageButtonClick"
            >
              <Spinner
                v-if="uploading"
                class="size-4"
              />
              <FontAwesomeIcon
                v-else
                :icon="faImage"
                class="size-4"
              />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {{ t('chat.uploadImage') }}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <!-- Hidden file input -->
      <input
        ref="fileInputRef"
        type="file"
        accept="image/*"
        multiple
        class="hidden"
        @change="handleFileSelect"
      >


      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger as-child>
            <!-- Send button -->
            <Button
              :disabled="!running && (input.trim() === '' && resources.length === 0)"
              size="sm"
              @click="sendUserInput"
            >
              <FontAwesomeIcon
                v-if="running"
                :icon="faStop"
                class="size-4"
              />
              <FontAwesomeIcon
                v-else
                :icon="faPaperPlane"
                class="size-4"
              />
              <span
                v-if="!running"
                class="hidden md:inline"
              >
                {{ t('chat.send') }}
              </span>
              <span
                v-else
                class="hidden md:inline"
              >
                {{ t('chat.stop') }}
              </span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>
              <KbdGroup>
                <Kbd>Ctrl / ⌘</Kbd>
                <span>+</span>
                <Kbd>Enter</Kbd>
              </KbdGroup>
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
</template>

