<script setup lang="ts">
import mermaid from 'mermaid'
import type { MermaidPage } from '@chat-tutor/agent'
import svgPanZoom from 'svg-pan-zoom'

type SvgPanZoomInstance = ReturnType<typeof svgPanZoom>

const { t } = useI18n()

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
const containerRef = ref<HTMLElement | null>(null)
let panZoomInstance: SvgPanZoomInstance | null = null
let renderId = 0

watch(() => props.page.steps, (steps) => {
  console.log('steps', steps)
  for (const step of steps) {
    if (step.type === 'set-mermaid') {
      const source = step.options.content.trim()
      const id = `mermaid-${props.page.id}-${renderId++}`
      mermaid.render(id, source).then((result) => {
        content.value = result.svg
        // Wait for DOM update before initializing svg-pan-zoom
        nextTick(() => {
          initializePanZoom()
        })
      })
    }
  }
}, { immediate: true, deep: true })

function initializePanZoom() {
  // Destroy previous instance if exists
  if (panZoomInstance) {
    panZoomInstance.destroy()
    panZoomInstance = null
  }

  if (!containerRef.value) return

  const svgElement = containerRef.value.querySelector('svg')
  if (svgElement) {
    // 设置 SVG 元素占满容器
    svgElement.style.width = '100%'
    svgElement.style.height = '100%'

    panZoomInstance = svgPanZoom(svgElement, {
      zoomEnabled: true,
      controlIconsEnabled: false,
      fit: true,
      center: true,
      contain: true, // 确保内容保持在视图内
      minZoom: 0.1,
      maxZoom: 10,
      zoomScaleSensitivity: 0.3,
      dblClickZoomEnabled: false,
    })

    // 初始化后立即适应屏幕
    setTimeout(() => {
      if (panZoomInstance) {
        panZoomInstance.resize()
        panZoomInstance.fit()
        panZoomInstance.center()
      }
    }, 0)
  }
}

function zoomIn() {
  if (panZoomInstance) {
    panZoomInstance.zoomIn()
  }
}

function zoomOut() {
  if (panZoomInstance) {
    panZoomInstance.zoomOut()
  }
}

function resetZoom() {
  if (panZoomInstance) {
    panZoomInstance.reset()
  }
}

function fitToScreen() {
  if (panZoomInstance) {
    panZoomInstance.fit()
    panZoomInstance.center()
  }
}

onUnmounted(() => {
  if (panZoomInstance) {
    panZoomInstance.destroy()
    panZoomInstance = null
  }
})
</script>

<template>
  <div class="size-full flex flex-col">
    <!-- Toolbar -->
    <div
      class="toolbar flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
      <button @click="zoomIn" class="toolbar-btn" :title="t('mermaid.zoomIn')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="11" y1="8" x2="11" y2="14"></line>
          <line x1="8" y1="11" x2="14" y2="11"></line>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <button @click="zoomOut" class="toolbar-btn" :title="t('mermaid.zoomOut')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="8" y1="11" x2="14" y2="11"></line>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      </button>

      <button @click="resetZoom" class="toolbar-btn" :title="t('mermaid.reset')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
          <path d="M21 3v5h-5"></path>
          <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
          <path d="M3 21v-5h5"></path>
        </svg>
      </button>

      <button @click="fitToScreen" class="toolbar-btn" :title="t('mermaid.fitToScreen')">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M8 3H5a2 2 0 0 0-2 2v3"></path>
          <path d="M21 8V5a2 2 0 0 0-2-2h-3"></path>
          <path d="M3 16v3a2 2 0 0 0 2 2h3"></path>
          <path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>
        </svg>
      </button>

      <div class="ml-2 text-sm text-gray-600 dark:text-gray-400">
        {{ t('mermaid.actionTip') }}
      </div>
    </div>

    <!-- Mermaid Content -->
    <div ref="containerRef" class="flex-1 overflow-hidden bg-white dark:bg-gray-900 p-4">
      <div v-html="content" class="size-full" />
    </div>
  </div>
</template>
<style scoped>
.toolbar-btn {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: white;
  border: 1px solid #d1d5db;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #374151;
  cursor: pointer;
}

.toolbar-btn:hover {
  background-color: #f9fafb;
}

.toolbar-btn:active {
  background-color: #f3f4f6;
}

:global(.dark) .toolbar-btn {
  background-color: #374151;
  border-color: #4b5563;
  color: #e5e7eb;
}

:global(.dark) .toolbar-btn:hover {
  background-color: #4b5563;
}

:global(.dark) .toolbar-btn:active {
  background-color: #4b5563;
}

/* 确保容器正确显示 SVG */
:deep(svg) {
  width: 100%;
  height: 100%;
  display: block;
}

/* svg-pan-zoom 会创建一个包装层 */
:deep(.svg-pan-zoom_viewport) {
  width: 100%;
  height: 100%;
}
</style>