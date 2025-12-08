<script setup lang="ts">
import mermaid from 'mermaid'
import type { MermaidPage } from '~~/packages/mermaid/src'

onMounted(() => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
  })
})

const props = defineProps<{
  page: MermaidPage
}>()

const content = ref('')
watch(() => props.page.steps, (steps) => {
  console.log('steps', steps)
  for (const step of steps) {
    if (step.type === 'set-mermaid') {
      const source = step.options.content.trim()
      mermaid.render('mermaid-container', source).then((result) => {
        content.value = result.svg
      })
    }
  }
}, { immediate: true })
</script>

<template>
  <div class="size-full flex items-center justify-center">
    <div v-html="content" class="size-full" />
  </div>
</template>