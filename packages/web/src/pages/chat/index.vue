<script setup lang="ts">
import { ChatUI, ChatBoard, ChatPagination } from '#/components/chat'
import { useCreateChatStore } from '#/utils/stores'
import { useChat } from '#/composables/use-chat'
import { useRoute } from 'vue-router'
import { Loading } from '#/components/loading'
import { onMounted, ref } from 'vue'

const route = useRoute()

const {
  messages,
  pages,
  currentPage,
  running,
  sync,
  ask,
  stop,
  switchPage
} = useChat(route.params.id as string)

const loading = ref(true)
const store = useCreateChatStore()

onMounted(async () => {
  await sync()
  if (pages.value.length > 0) {
    switchPage(pages.value[0]!.id)
  }
  if (store.prompt !== null || store.resources.length > 0) {
    const prompt = store.prompt!
    const resources = store.resources
    store.prompt = null
    store.resources = []
    ask(prompt, resources)
    console.log('ask', prompt, resources)
  }
  loading.value = false
})


</script>

<template>
  <template v-if="loading">
    <Loading />
  </template>
  <div
    v-else
    class="size-full flex flex-row overflow-y-auto flex-wrap max-md:pb-40"
  >
    <div class="max-md:mx-2 w-full md:w-5/7 flex flex-col md:h-full py-2 gap-2 overflow-hidden">
      <div class="flex flex-row flex-1 min-h-0 overflow-hidden">
        <ChatBoard
          :pages="pages"
          :current="currentPage"
        />
      </div>
      <div class="flex flex-row h-48 shrink-0">
        <ChatPagination
          :pages="pages"
          @switch="switchPage"
        />
      </div>
    </div>
    <div class="max-md:mx-2 w-full md:w-2/7 md:h-full overflow-hidden">
      <ChatUI
        v-model:messages="messages"
        :running="running"
        @send="(input, resources) => ask(input, resources)"
        @stop="stop"
      />
    </div>
  </div>
</template>