<script setup lang="ts">
import { useRouter } from 'vue-router';
import templates from '../templates';
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { createRenderer, type RendererError } from '@dsl/renderer-runtime';
import Files from '../components/Files.vue';
import Errors from '../components/Errors.vue';

const router = useRouter()

const template = computed(() => {
  const type = router.currentRoute.value.params.type as string
  const id = router.currentRoute.value.params.id as string | undefined
  const set = templates.find(template => template.id === type) ?? null
  if (set?.templates) {
    return set.templates.find(template => template.id === id) ?? null
  } else {
    return set ?? null
  }
})

type Tab = 'list' | 'errors'
const tab = ref<Tab>('list')
const tabs: Tab[] = ['list', 'errors']
const tabIcon = (tab: Tab) => {
  switch (tab) {
    case 'list':
      return '📚'
    case 'errors':
      return '🚨'
  }
}

// ------

const container = ref<HTMLElement | null>(null)

const errors = ref<RendererError<string>[]>([])

const _render = () => {
  const { content, type } = template.value ?? {}
  if (!content) return
  const { render, getErrors } = createRenderer()
  render(content, container.value!)
  nextTick(() => {
    console.log(getErrors())
    errors.value = getErrors()
  })
}

watch(template, _render)
console.log(_render)

onMounted(() => {
  _render()
})
</script>

<template>
  <div class="size-full flex flex-row gap-2 dsl-board">
    <div class="container-common w-12 p-1 gap-1 flex flex-col">
      <div
        v-for="tabName in tabs"
        :key="tabName"
        class="size-8 container-common container-interactive flex items-center justify-center cursor-pointer"
        :class="{ 'bg-gray-200': tab === tabName }"
        @click="tab = tabName"
      >
        <div class="size-full">
          {{ tabIcon(tabName) }}
        </div>
      </div>
    </div>
    <Files v-show="tab === 'list'" />
    <Errors
      v-show="tab === 'errors'"
      :errors="errors"
    />
    <div class="container-common w-3/4 overflow-y-auto p-0">
      <div
        ref="container"
        class="w-full h-100 preview flex items-center justify-center"
      />
    </div>
  </div>
</template>

<style scoped>
</style>