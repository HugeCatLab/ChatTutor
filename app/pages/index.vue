<script setup lang="ts">
import type { Resource } from '../components/PromptArea.vue'

const input = ref('')
const running = ref(false)
const resources = ref<Resource[]>([])

const { baseURL, apiKey, agentModel, painterModel } = useSettings()

const create = async () => {
  running.value = true
  const query = {
    input: input.value,
    apiKey: apiKey.value,
    baseURL: baseURL.value,
    agentModel: agentModel.value,
    painterModel: painterModel.value,
  }
  const { id } = await $fetch<{ id: string }>(`/api/chat/create?${new URLSearchParams(query).toString()}`, {
    method: 'POST',
  })
  running.value = false
  navigateTo(`/chat/${id}?input=${input.value}&images=${resources.value.filter(r => r.type === 'image').map(r => r.url).join(',')}`)
}

const getTime = (): 'morning' | 'afternoon' | 'evening' => {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 18) return 'afternoon'
  return 'evening'
}
</script>

<template>
  <div class="size-full h-screen flex flex-col">
    <div class="w-full flex flex-row items-center gap-2 justify-end md:justify-start px-10 py-5">
      <div class="flex flex-row items-center">
        <img
          src="/logo.png"
          alt="ChatTutor"
          width="32"
          height="32"
        >
      </div>
      <span class="text-xl font-semibold text-gray-400 select-none">ChatTutor</span>
    </div>
    <div class="size-full h-full flex flex-col gap-10 items-center justify-center py-10">
      <h1 class="title text-3xl md:text-4xl font-mono flex text-center pt-24 select-none">
        Good {{ getTime() }}, Let's start!
      </h1>
      <div class="w-full flex flex-col h-full justify-end md:justify-center items-center mb-auto">
        <div class="flex justify-end px-10 w-full md:max-w-200 h-35">
          <PromptArea
            v-model:input="input"
            v-model:resources="resources"
            :running="running"
            @send="create"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.title {
  background: linear-gradient(to right, #90EE90 0%, #8BDEBD 50%, #87CEEB 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  color: transparent;
}
</style>
