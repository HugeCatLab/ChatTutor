<script setup lang="ts">
import { ref } from 'vue'
import { PromptArea, type Resource } from '#/components/prompt-area'
import { client } from '#/utils/client'

const input = ref('')
const resources = ref<Resource[]>([])
const running = ref(false)

const handleSend = async (message: string, attachments: Resource[]) => {
  const { data, error } = await client.chat.post({})
  if (error) {
    return
  }
  const { id } = data
  console.log(id)
}
</script>

<template>
  <div class="size-full flex flex-col p-5">
    <div class="flex flex-row w-full justify-start items-center gap-1">
      <img
        src="/logo.png"
        alt="ChatTutor"
        class="w-10 h-10"
      >
      <span class="text-xl title font-bold select-none">ChatTutor</span>
    </div>
    <div class="flex size-full items-center justify-center flex-col gap-18">
      <h1 class="text-4xl title select-none font-mono">
        Hello, let's begin!
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
