<script setup lang="ts">
import { v4 as uuid } from 'uuid'
import type { GGBPage } from '@chat-tutor/agent'
import type { GGBAppletAPI, GGBAppletInstance } from '@chat-tutor/geogebra-applet'

const props = defineProps<{
  page: GGBPage
}>()

const id = `ggb-${uuid()}`
const apiRef = ref<GGBAppletAPI | null>(null)
const containerRef = ref<HTMLDivElement | null>(null)

const loadGGBApplet = () => new Promise<{
  api: GGBAppletAPI
  applet: GGBAppletInstance
}>((resolve) => {
  const applet = new GGBApplet({
    id,

    appletOnLoad(api) {
      resolve({
        api,
        applet,
      })
    }
  })
  applet.inject(id)
})

onMounted(async () => {
  await nextTick()
  const { api } = await loadGGBApplet()
  apiRef.value = api
  console.log('GGBApplet loaded', api)

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
})

watch([apiRef, () => props.page.steps], ([api, steps]) => {
  if (!api) return
  console.log('ggb-steps', steps)
  for (const step of steps) {
    if (step.type === 'run-ggbscript') {
      const content = step.options.content
      content.split('\n').forEach(api.evalCommand)
    }
  }
}, { immediate: true, deep: true })
</script>

<template>
  <div :id="id" ref="containerRef" class="flex size-full" />
</template>