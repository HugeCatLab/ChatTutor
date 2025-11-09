<script setup lang="ts">
const input = ref('')

const create = async () => {
  const { id } = await $fetch<{ id: string }>('/api/chat/create', {
    method: 'POST',
  })
  navigateTo(`/chat/${id}?input=${input.value}`)
}
</script>

<template>
  <div class="size-full h-screen flex flex-col">
    <div class="w-full flex flex-row justify-end md:justify-start px-10 py-5">
      <span class="text-xl font-semibold text-gray-400 select-none">ChatTutor</span>
    </div>
    <div class="size-full h-full flex flex-col gap-10 items-center justify-center py-10">
      <h1 class="text-3xl md:text-4xl font-mono text-gray-600 flex text-center pt-24 select-none">
        Welcome to ChatTutor!
      </h1>
      <div class="w-full flex flex-col h-full justify-end md:justify-center items-center mb-auto">
        <div class="flex justify-end px-10 w-full md:max-w-200 h-35">
          <PromptArea v-model:input="input" @keydown.enter="create" @send="create" />
        </div>
      </div>
    </div>
  </div>
</template>