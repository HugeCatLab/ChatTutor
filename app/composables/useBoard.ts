import type { createRenderer } from '@dsl/renderer-runtime'
import type { CanvasPage } from '@chat-tutor/canvas'
import type { BaseForm, FormType, FullAction } from '@chat-tutor/shared'
import type { FormCreationAction, PageCreationAction, PageNoteAction } from '@chat-tutor/agent'
import type { createMermaidRenderer, MermaidPage, MermaidPageAction  } from '@chat-tutor/mermaid'

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
    watch(page, (page) => {
      if (page) {
        const p = currentPages.value.find(p => p.id === page)
        if (p) {
          notes.value = p.notes
          forms.value = p.forms
        }
      }
    })
  })


  const loadPage = (p: Page) => {
    currentPages.value.push(p)
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
