import { createRenderer } from '@dsl/renderer-runtime'
import type { CanvasPage } from '@chat-tutor/canvas'
import type { BaseForm, FormType, FullAction } from '@chat-tutor/shared'
import { PageType } from '@chat-tutor/shared'
import type { FormCreationAction, PageCreationAction, PageNoteAction } from '@chat-tutor/agent'
import { createMermaidRenderer, type MermaidPage, type MermaidPageAction } from '@chat-tutor/mermaid'

import '@dsl/math'

export type Page = CanvasPage | MermaidPage

export type ActionHandler = (action: FullAction) => void

export const rendererMap = new Map<string,
  ReturnType<typeof createRenderer> | ReturnType<typeof createMermaidRenderer>
>()

export const useBoard = () => {
  const board = ref<HTMLElement | null>(null)
  const currentPages = ref<Page[]>([])
  const page = ref<string | null>(null)
  const notes = ref<string[]>([])
  const forms = ref<BaseForm<FormType>[]>([])

  onMounted(() => {
    watch(page, (id) => {
      const p = currentPages.value.find(p => p.id === id)
      if (p && p.notes) {
        notes.value = p.notes
      }
      if (p && p.forms) {
        forms.value = p.forms
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

  const loadCanvasPage = (page: CanvasPage) => {
    const container = document.createElement('div')
    container.id = page.id!
    container.style.width = '100%'
    container.style.border = '1px solid grey'
    container.style.borderRadius = '10px'
    container.style.display = 'flex'
    container.style.justifyContent = 'center'
    container.style.padding = '10px'
    board.value!.appendChild(container)
    const renderer = createRenderer()
    rendererMap.set(page.id!, renderer)
    for (const step of page.steps) {
      handleCanvasAction(step)
    }
  }

  const loadMermaidPage = (page: MermaidPage) => {
    console.log('loadMermaidPage', page)
    const container = document.createElement('div')
    container.id = page.id!
    container.className = 'mermaid'
    container.style.width = '90%'
    container.style.height = '100%'
    container.style.display = 'block'
    container.style.maxHeight = '500px'
    container.style.overflow = 'auto'
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
    // console.log('handleAction', action)
    if (['document'].includes(action.type)) {
      handleCanvasAction(action)
    } else if (action.type === 'page') {
      handlePageCreationAction(action as unknown as PageCreationAction)
    } else if (action.type === 'note') {
      handlePageNoteAction(action as PageNoteAction)
    } else if (action.type === 'form-creation') {
      handleFormCreationAction(action as FormCreationAction)
    } else if (['set-mermaid'].includes(action.type)) {
      handleMermaidAction(action as MermaidPageAction)
    }
  }

  const handleFormCreationAction: ActionHandler = (action) => {
    const p = currentPages.value.find(p => p.id === action.page)
    if (!p) return
    p.forms.push(action.options as BaseForm<FormType>)
    if (p.id === page.value) {
      forms.value = p.forms
    }
  }

  const handleCanvasAction: ActionHandler = (action) => {
    console.log('handleCanvasAction', action)
    const page = currentPages.value.find(p => p.id === action.page)
    if (!page) return
    console.log('page', page)
    if (action.type === 'document') {
      const renderer = rendererMap.get(page.id!) as ReturnType<typeof createRenderer>
      if (renderer) {
        const container = board.value!.querySelector(`#${page.id!}`)
        if (container) {
          renderer.render(action.options.content as string, container as HTMLElement)
        }
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
    forms,
    currentPages,
    handleAction,
    loadPage,
    loadPages,
  }
}
