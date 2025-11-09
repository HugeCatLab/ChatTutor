<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faBars, faAdd } from '@fortawesome/free-solid-svg-icons'

const route = useRouter().currentRoute
const width: Ref<number | null> = ref(null)

const collapsed = ref(false)
onMounted(() => {
  width.value = window.innerWidth
  watch(route, (r) => {
    collapsed.value = r.path === '/' && width.value! > 768
  }, { immediate: true })
})

type Chat = {
  title: string
  id: string
  date: string
}

const chats = ref<Chat[]>([])

void (async () => {
  const c = await $fetch<{ id: string, title: string, createdAt: string, updatedAt: string, status: Status }[]>('/api/chat/history')
  chats.value = c.map((chat) => ({
    id: chat.id,
    title: chat.title,
    date: chat.createdAt,
  }))
})()
</script>

<template>
  <div class="min-h-screen w-full bg-gray-50 flex flex-row">
    <div
      class="fixed z-9999 left-0 top-0 md:relative h-screen max-h-screen flex flex-col p-5 transition-all duration-300 ease-in-out overflow-hidden"
      :class="collapsed ? 'w-4/5 md:w-80 bg-gray-200 shadow-lg' : 'w-20 bg-transparent md:bg-gray-200'"
    >
      <ButtonContainer
        class="size-10 justify-center items-center flex"
        @click="collapsed = !collapsed"
      >
        <FontAwesomeIcon :icon="faBars" />
      </ButtonContainer>
      <div class="flex h-full flex-col py-5 gap-10">
        <ButtonContainer
          class="flex flex-row w-full items-center justify-center gap-5 cursor-pointer select-none"
          @click="navigateTo('/')"
          v-show="width! > 768 || collapsed"
        >
          <FontAwesomeIcon :icon="faAdd" />
          <Transition name="fade">
            <span v-show="collapsed">New Chat</span>
          </Transition>
        </ButtonContainer>
        <Transition name="fade">
          <div
            v-show="collapsed"
            class="flex flex-col gap-5 text-gray-600 overflow-y-auto"
          >
            <h2 class="text-sm font-bold select-none">
              Recent
            </h2>
            <ButtonContainer
              v-for="chat in chats"
              :key="chat.id"
              class="text-sm w-full cursor-pointer select-none p-2"
              @click="navigateTo(`/chat/${chat.id}`)"
            >
              <div class="flex flex-row items-center gap-5">
                <div class="flex flex-col">
                  <h3>{{ chat.title }}</h3>
                  <p>{{ chat.date }}</p>
                </div>
              </div>
            </ButtonContainer>
          </div>
        </Transition>
      </div>
    </div>
    <div class="flex size-full">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
