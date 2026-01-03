<script setup lang="ts">
import { computed, ref } from 'vue'
import { PromptArea } from '#/components/prompt-area'
import { type Resource } from '@chat-tutor/shared'
import { client } from '#/utils/client'
import { useCreateChatStore } from '#/utils/stores'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useSidebar } from '@chat-tutor/ui'

const input = ref('')
const resources = ref<Resource[]>([])
const running = ref(false)

const store = useCreateChatStore()
const router = useRouter()
const { t } = useI18n()

const handleSend = async (message: string, attachments: Resource[]) => {
  const { data, error } = await client.chat.post({
    input: message,
  })
  if (error) {
    return
  }
  store.prompt = message
  store.resources = attachments
  const { id } = data
  router.push(`/chat/${id}`)
}

const getTime = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}

const greeting = computed(() => {
  const time = getTime()
  return t('home.title', { time: t(`home.greeting.${time}`) })
})

const { isMobile } = useSidebar()
</script>

<template>
  <div class="size-full flex flex-col p-5">
    <div
      class="flex flex-row w-full justify-start items-center gap-1"
      :class="{ 'ml-10': isMobile }"
    >
      <img
        src="/logo.png"
        alt="ChatTutor"
        class="w-10 h-10"
      >
      <span class="text-xl title font-bold select-none">ChatTutor</span>
    </div>
    <div class="flex size-full items-center justify-center flex-col gap-18">
      <h1 class="text-4xl title select-none font-mono">
        {{ greeting }}
      </h1>
      <div class="h-32 w-full max-w-2xl">
        <PromptArea
          v-model:input="input"
          v-model:resources="resources"
          :running="running"
          @send="handleSend"
        />
      </div>
    </div>
  </div>
</template>

<style lang="css" scoped>
.title {
  background: linear-gradient(to right, #90EE90 0%, #8BDEBD 50%, #87CEEB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
