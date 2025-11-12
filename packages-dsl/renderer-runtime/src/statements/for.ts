import type { BaseElement, Context} from "@dsl/renderer-core";
import { createAdhoc, defineStatement, effect, mergeContext, reactive, ref, registerStatement } from "@dsl/renderer-core";
import { toArray } from "../renderer";
import morph from 'morphdom'

export const forStatement = defineStatement((source) => {
  const resolve = (
    iterable: Iterable<unknown>,
    v: string,
    element: BaseElement<string>,
    res: (element: BaseElement<string>, context: Context) => Node | Node[] | null,
    context: Context
  ) => toArray(
    Array.from(iterable).flatMap(item => {
      // Create a new context for each iteration to prevent value pollution
      const iterationContext = mergeContext(reactive({}), context)
      iterationContext[v] = ref(item)
      console.log('v', v, item)
      const result = res(element, iterationContext)
      return toArray(result).filter(child => child !== null && child !== undefined)
    })
  ).filter(child => child !== null && child !== undefined)

  return {
    pre(context, element, res) {
      const [v, iterableSource] = source.split(' in ')
      console.log('v', v, iterableSource, source)
      delete element.statements!['for']

      console.log(element)
      // Initial render
      const initialIterable = createAdhoc(context)(iterableSource) as Iterable<unknown>
      const target: Node[] = resolve(initialIterable, v, element, res, context)

      effect(() => {
        // Re-compute iterable inside effect to track reactive changes
        const iterable = createAdhoc(context)(iterableSource) as Iterable<unknown>
        const nodes = resolve(iterable, v, element, res, context)
        if (nodes.length === 0) {
          target.length = 0
          return target.push(document.createDocumentFragment())
        }
        if (target[0]!.parentElement) {
          const parent = target[0]!.parentElement
          for (const [index, node] of target.entries()) {
            if (index < nodes.length) {
              morph(node, nodes[index])
            } else {
              parent.removeChild(node)
              target.splice(index, 1)
            }
          }
          if (target.length < nodes.length) {
            const lastNode = target.at(-1)
            const insertPosition = lastNode ? lastNode.nextSibling : null
            nodes.slice(target.length, nodes.length).forEach(node => {
              parent.insertBefore(node, insertPosition)
              target.push(node)
            })
          }
        }
      })
      return target
    }
  }
})

registerStatement('for', forStatement)
