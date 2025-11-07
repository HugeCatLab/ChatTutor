import mermaid from 'mermaid'
import type { MermaidPageAction } from './page'

export const createMermaidRenderer = (
  container: HTMLElement,
) => {
  mermaid.initialize({
    startOnLoad: true,
    theme: 'neutral',
  })

  const content: string[] = []

  const load = (actions: MermaidPageAction[]) => {
    for (const action of actions) {
      if (action.type === 'set-mermaid') {
        content.length = 0
        content.push(action.options.content)
      }
      console.log('load', content.join('\n\n'))
      mermaid.render(`${container.id}-mermaid`, content.join('\n\n')).then((result) => {
        container.innerHTML = result.svg
      })
    }
  }

  return {
    load,
  }
}