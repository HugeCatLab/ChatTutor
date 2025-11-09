import { createCanvasRenderer } from '@chat-tutor/canvas'
import type { CanvasPage, CanvasPageAction } from '@chat-tutor/canvas'
import type { FullAction } from '@chat-tutor/shared'
import { PageType } from '@chat-tutor/shared'
import type { PageCreationAction, PageNoteAction, CanvasPageUpdateAction } from '@chat-tutor/agent'
import { createMermaidRenderer, type MermaidPage, type MermaidPageAction } from '@chat-tutor/mermaid'

export type Page = CanvasPage | MermaidPage

export type ActionHandler = (action: FullAction) => void

export const useBoard = () => {
  const board = ref<HTMLElement | null>(null)
  const currentPages = ref<Page[]>([])
  const page = ref<string | null>(null)
  const notes = ref<string[]>([])

  onMounted(() => {
    watch(page, (id) => {
      const p = currentPages.value.find(p => p.id === id)
      if (p && p.notes) {
        notes.value = p.notes
      }
      nextTick(() => {
        if (!id) return
        const ctn = board.value!.querySelector(`#${id}`)
        if (!ctn) return
        [...board.value!.childNodes].forEach(child => {
          (<HTMLElement>child).style.display = 'none'
        })
        ;(<HTMLElement>ctn).style.display = 'block'
      })
    })
  })

  const rendererMap = new Map<string,
    ReturnType<typeof createCanvasRenderer> | ReturnType<typeof createMermaidRenderer>
  >()

  const loadCanvasPage = (page: CanvasPage) => {
    const container = document.createElement('div')
    container.id = page.id!
    container.className = 'jxgbox'
    container.style.width = '90%'
    container.style.height = '500px'
    container.style.display = 'flex'
    board.value!.appendChild(container)
    const renderer = createCanvasRenderer(container.id, {
      range: page.range,
      domain: page.domain,
      axis: page.axis,
      grid: page.grid,
    })
    rendererMap.set(page.id!, renderer)
    renderer.load(page.steps)
  }

  const loadMermaidPage = (page: MermaidPage) => {
    console.log('loadMermaidPage', page)
    const container = document.createElement('div')
    container.id = page.id!
    container.className = 'mermaid'
    container.style.width = '90%'
    container.style.height = '500px'
    container.style.display = 'flex'
    container.style.maxHeight = '500px'
    container.style.overflowY = 'auto'
    board.value!.appendChild(container)
    const renderer = createMermaidRenderer(container)
    rendererMap.set(page.id!, renderer)
    renderer.load(page.steps)
  }

  const loadPage = (p: Page) => {
    currentPages.value.push(p)
    if (p.type === PageType.CANVAS) {
      loadCanvasPage(p)
    } else if (p.type === PageType.MERMAID) {
      loadMermaidPage(p)
    }
    page.value = p.id!
  }
  
  const loadPages = (pages: Page[]) => pages.forEach(loadPage)

  const handleAction: ActionHandler = (action) => {
    if (['element', 'update-canvas'].includes(action.type)) {
      handleCanvasAction(action)
    } else if (action.type === 'page') {
      handlePageCreationAction(action as unknown as PageCreationAction)
    } else if (action.type === 'note') {
      handlePageNoteAction(action as PageNoteAction)
    } else if (['set-mermaid'].includes(action.type)) {
      handleMermaidAction(action as MermaidPageAction)
    }
  }

  const handleCanvasAction: ActionHandler = (action) => {
    const page = currentPages.value.find(p => p.id === action.page)
    if (!page) return
    if (action.type === 'element') {
      const renderer = rendererMap.get(page.id!)
      if (renderer) {
        ; (<ReturnType<typeof createCanvasRenderer>>renderer).load([action as CanvasPageAction])
      }
    } else if (action.type === 'update-canvas') {
      const renderer = rendererMap.get(page.id!)
      if (renderer) {
        const { range, domain } = action.options as CanvasPageUpdateAction['options']
        ; (<ReturnType<typeof createCanvasRenderer>>renderer).setBound(range, domain)
      }
    }
  }

  const handlePageCreationAction = (action: PageCreationAction) => {
    loadPage(action.options as CanvasPage)
  }

  const handlePageNoteAction = (action: PageNoteAction) => {
    const p = currentPages.value.find(p => p.id === action.page)
    if (!p) return
    p.notes.push(action.options.content)
    if (page.value === p.id) {
      notes.value = p.notes
    }
  }

  const handleMermaidAction: ActionHandler = (action) => {
    if (action.type === 'set-mermaid') {
      const page = currentPages.value.find(p => p.id === action.page)
      if (!page) return
      const renderer = rendererMap.get(page.id!)
      if (renderer) {
        ;(<ReturnType<typeof createMermaidRenderer>>renderer).load([action as MermaidPageAction])
      }
    }
  }

  return {
    board,
    page,
    notes,
    currentPages,
    handleAction,
    loadPage,
    loadPages,
  }
}
