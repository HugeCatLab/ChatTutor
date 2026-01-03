import type { ClientAction } from '@chat-tutor/shared'
import { computed, inject, onMounted, provide, ref, watch, type Ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'

export type IdentifiedAction = ClientAction & {
  id: string
}
type ActionHandler = (action: IdentifiedAction) => boolean

export const createActionStack = (name: string) => {
  const stack = ref<IdentifiedAction[]>([])

  provide(name, stack)

  const push = (action: ClientAction) => {
    stack.value.push({ ...action, id: uuidv4() })
  }


  return {
    push,
  }
}

export const useActionStack = (name: string) => {
  const stack = inject<Ref<IdentifiedAction[]>>(name)
  if (!stack) {
    throw new Error(`Action stack ${name} not found`)
  }

  const usePageActionStack = (page: string) => {
    const pageStack = computed(() => stack.value.filter(action => action.page === page))
    const processedIds = ref<Set<string>>(new Set())
    let act: ActionHandler = () => false
    
    const onAction = (handler: ActionHandler) => {
      act = handler
      // Process any existing actions immediately after handler is registered
      const completedIds: string[] = []
      for (const action of pageStack.value) {
        if (processedIds.value.has(action.id)) {
          continue
        }
        if (handler(action)) {
          completedIds.push(action.id)
          processedIds.value.add(action.id)
        }
      }
      if (completedIds.length > 0) {
        stack.value = stack.value.filter(a => !completedIds.includes(a.id))
      }
    }

    onMounted(() => {
      watch(pageStack, (actions) => {
        const completedIds: string[] = []
        for (const action of actions) {
          // Skip already processed actions
          if (processedIds.value.has(action.id)) {
            continue
          }
          if (act(action)) {
            completedIds.push(action.id)
            processedIds.value.add(action.id)
          }
        }
        // Remove completed actions from stack
        if (completedIds.length > 0) {
          stack.value = stack.value.filter(a => !completedIds.includes(a.id))
        }
      }, { deep: true })
    })

    return {
      onAction,
    }
  }
  
  return usePageActionStack
}