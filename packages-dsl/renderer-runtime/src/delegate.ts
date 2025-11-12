import type { Context} from "@dsl/renderer-core";
import { createAdhoc } from "@dsl/renderer-core";

export function createDelegate(node: Node, context: Context) {
  const adhoc = createAdhoc(context)
  const wrap = (handlerSource: string) => {
    return `(function() { ${handlerSource} })`
  }
  return (event: string, handler: string | (() => void)) => {
    const handlerFunction = typeof handler === 'string' ? adhoc(wrap(handler)) : handler
    node.addEventListener(event, handlerFunction)
  }
}