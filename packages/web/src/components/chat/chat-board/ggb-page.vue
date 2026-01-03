<script setup lang="ts">
import { useActionStack } from '#/composables/use-action-stack'
import type { GGBAppletAPI } from '@chat-tutor/ggb-applet'
import type { GGBPage, GGBScriptExcuteAction } from '@chat-tutor/shared'
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

const props = defineProps<{
  page: GGBPage
  visible?: boolean
}>()

const apiRef = ref<GGBAppletAPI | null>(null)
const containerRef = ref<HTMLElement | null>(null)
const isInitialized = ref(false)

const usePageActionStack = useActionStack('chat')
const { onAction } = usePageActionStack(props.page.id)

onAction((action) => {
  if (!apiRef.value) return false
  if (action.type === 'ggbscript-excute') {
    const content = (action as GGBScriptExcuteAction).options.content
    content
      .split('\n')
      .filter((line) => !line.trim().startsWith('#') && line.trim() !== '')
      .forEach(apiRef.value?.evalCommand)
    return true
  }
  return false
})

const loadGGBApplet = () => new Promise<{
  api: GGBAppletAPI
}>((resolve) => {
  const applet = new GGBApplet({
    id: props.page.id,
    

    appletOnLoad(api) {
      resolve({ api })
    }
  })
  applet.inject(props.page.id)
})

const initializeGGBApplet = async () => {
  if (isInitialized.value) return
  isInitialized.value = true

  await nextTick()
  const { api } = await loadGGBApplet()
  apiRef.value = api

  // Force recalculate to ensure proper sizing
  nextTick(() => {
    api.recalculateEnvironments()
  })

  // Use ResizeObserver to handle container size changes
  if (containerRef.value) {
    const resizeObserver = new ResizeObserver(() => {
      if (api) {
        api.recalculateEnvironments()
      }
    })
    resizeObserver.observe(containerRef.value)

    onBeforeUnmount(() => {
      resizeObserver.disconnect()
    })
  }
}

onMounted(() => {
  // Initialize immediately if visible
  if (props.visible) {
    initializeGGBApplet()
  }
})

watch([apiRef], ([api]) => {
  if (!api) return
  for (const step of props.page.steps) {
    if (step.type === 'ggbscript-excute') {
      const content = (step as GGBScriptExcuteAction).options.content
      content
        .split('\n')
        .filter((line) => !line.trim().startsWith('#') && line.trim() !== '')
        .forEach(api.evalCommand)
    }
  }
})

// Watch visibility changes to initialize or recalculate when page becomes visible
watch(() => props.visible, (visible) => {
  if (visible) {
    if (!isInitialized.value) {
      // Initialize on first visibility
      initializeGGBApplet()
    } else if (apiRef.value) {
      // Recalculate on subsequent visibility
      nextTick(() => {
        apiRef.value?.recalculateEnvironments()
      })
    }
  }
})
</script>

<template>
  <div
    :id="page.id"
    ref="containerRef"
    class="flex size-full"
  />
</template>