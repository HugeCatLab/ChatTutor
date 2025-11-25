<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane, faSpinner, faImage } from '@fortawesome/free-solid-svg-icons'

const input = defineModel<string>('input', { required: true })
const resources = defineModel<Resource[]>('resources', { required: true })
const textareaRef = ref<HTMLTextAreaElement | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

const { running } = defineProps<{
  running: boolean
}>()

const blur = () => {
  textareaRef.value?.blur()
}

const emits = defineEmits<{
  (e: 'send', input: string, resources: Resource[]): void
}>()

const sendUserInput = () => {
  blur()
  emits('send', input.value, resources.value)
}
// Using short cut to send message
const shortCutSend = (event: KeyboardEvent) => {
  // cmd+enter (Mac) or ctrl+enter (Windows/Linux)
  if (running) return
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault()
    sendUserInput()
  }
}
// Click to send the message
const send = () => {
  sendUserInput()
}

export type ImageResource = {
  type: 'image'
  url: string
  id: string
}

export type Resource = ImageResource

const uploading = ref(false)
const isDragging = ref(false)

const removeResource = (id: string) => {
  resources.value = resources.value.filter(r => r.id !== id)
}

const addResource = (resource: Resource) => {
  resources.value.push(resource)
}

const uploadFile = async (file: File) => {
  if (!file.type.startsWith('image/')) {
    console.error('Only image files are allowed')
    return
  }

  uploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await $fetch<{ url: string; id: string; key: string }>('/api/file/upload', {
      method: 'POST',
      body: formData,
    })

    addResource({
      type: 'image',
      url: response.url,
      id: response.id,
    })
  } catch (error) {
    console.error('Failed to upload file:', error)
  } finally {
    uploading.value = false
  }
}

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

const handleImageButtonClick = () => {
  fileInputRef.value?.click()
}

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

defineExpose({
  blur
})
</script>

<template>
  <div
    ref="containerRef"
    class="size-full bg-gray-100 dark:bg-gray-700 p-2 rounded-lg flex flex-row items-center justify-center md:flex-col border shadow-lg transition-all"
    :class="isDragging ? 'border-blue-500 border-2 bg-blue-50' : 'border-gray-300 dark:border-gray-500'"
    @dragover="handleDragOver"
    @dragleave="handleDragLeave"
    @drop="handleDrop"
    @paste="handlePaste"
  >
    <textarea
      ref="textareaRef"
      v-model="input"
      class="size-full bg-transparent outline-none resize-none text-gray-500 md:flex-1"
      @keydown="shortCutSend"
    />
    <div
      v-if="resources.length > 0"
      class="flex flex-row items-center w-full gap-2"
    >
      <div
        v-for="resource in resources"
        :key="resource.id"
        class="size-10"
      >
        <Image
          :url="resource.url"
          @remove="removeResource(resource.id)"
        />
      </div>
    </div>
    <div class="flex flex-row items-center justify-center md:w-full h-10">
      <div class="flex flex-row w-full items-center justify-start">
        <ButtonContainer
          class="size-8 justify-center items-center flex"
          :class="{ 'opacity-50 cursor-not-allowed': uploading }"
          @click="handleImageButtonClick"
        >
          <FontAwesomeIcon
            :icon="uploading ? faSpinner : faImage"
            class="size-4"
            :class="{ 'animate-spin': uploading }"
          />
        </ButtonContainer>
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          multiple
          class="hidden"
          @change="handleFileSelect"
        >
      </div>
      <div class="w-full flex flex-row mr-auto justify-end">
        <ButtonContainer
          class="size-8 justify-center items-center flex"
          :class="{ 'opacity-50 cursor-not-allowed': running }"
          @click="send"
        >
          <FontAwesomeIcon
            :icon="running ? faSpinner : faPaperPlane"
            class="size-4"
            :class="{ 'animate-spin': running }"
          />
        </ButtonContainer>
      </div>
    </div>
  </div>
</template>
