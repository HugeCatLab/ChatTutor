import { createAdhoc, defineStatement, effect, registerStatement, ref, type Ref, type BaseElement  } from "@dsl/renderer-core";
import { createDelegate } from "../delegate"

// 条件块状态管理
const conditionBlockStates = new WeakMap<HTMLElement, {
  conditions: { ref: Ref<boolean>, source: string }[]
  elements: { element: HTMLElement, type: 'if' | 'elif' | 'else', index: number }[]
}>()

// 获取条件块的根元素（通过向上查找父元素）
function getConditionBlockRoot(element: HTMLElement): HTMLElement {
  let current = element.parentElement
  while (current) {
    if (conditionBlockStates.has(current)) {
      return current
    }
    current = current.parentElement
  }
  // 如果没找到，使用当前元素的父元素作为根
  return element.parentElement || element
}

// 初始化或获取条件块状态
function getOrCreateConditionBlockState(root: HTMLElement) {
  if (!conditionBlockStates.has(root)) {
    conditionBlockStates.set(root, {
      conditions: [],
      elements: []
    })
  }
  return conditionBlockStates.get(root)!
}

// 更新条件块中所有元素的显示状态
function updateConditionBlock(root: HTMLElement, context: Record<string, unknown>) {
  const state = conditionBlockStates.get(root)
  if (!state) return

  let matchedIndex = -1

  // 计算所有条件
  for (let i = 0; i < state.conditions.length; i++) {
    const { ref: conditionRef, source } = state.conditions[i]
    const condition = source ? createAdhoc(context)(source) : true // else 条件始终为 true
    conditionRef.value = condition

    if (matchedIndex === -1 && condition) {
      matchedIndex = i
    }
  }

  // 更新所有元素的显示状态
  state.elements.forEach(({ element, index }) => {
    const display = element.getAttribute('data-original-display') || ''
    if (index === matchedIndex) {
      element.setAttribute('data-state', 'passed')
      element.style.display = display
    } else {
      element.setAttribute('data-state', 'failed')
      element.style.display = 'none'
    }
  })
}

// 处理事件绑定和动画的通用函数
function setupElementInteractions(
  node: Node,
  element: BaseElement<string>,
  context: Record<string, unknown>
) {
  // 事件绑定
  const delegate = (node: Node, events: Record<string, string | (() => void)>) => {
    const _delegate = createDelegate(node, context)
    Object.entries(events).forEach(([event, handler]) => {
      _delegate(event, handler)
    })
    return _delegate
  }

  // 绑定事件和动画
  delegate(node, element.events ?? {})
}

export const ifStatement = defineStatement((source) => {
  return {
    post(context, element, node) {
      const target = node as HTMLElement
      const display = target.style.display
      target.setAttribute('data-original-display', display)

      const root = getConditionBlockRoot(target)
      const state = getOrCreateConditionBlockState(root)

      const conditionRef = ref(false)
      const index = state.conditions.length

      state.conditions.push({ ref: conditionRef, source })
      state.elements.push({ element: target, type: 'if', index })

      // 设置事件绑定和动画
      setupElementInteractions(node, element, context)

      effect(() => {
        updateConditionBlock(root, context)
      })

      return node
    }
  }
})

export const elseStatement = defineStatement(() => {
  return {
    post(context, element, node) {
      const target = node as HTMLElement
      const display = target.style.display
      target.setAttribute('data-original-display', display)

      const root = getConditionBlockRoot(target)
      const state = getOrCreateConditionBlockState(root)

      const conditionRef = ref(true) // else 条件始终为 true，但只在前面条件都为 false 时显示
      const index = state.conditions.length

      state.conditions.push({ ref: conditionRef, source: '' }) // 空 source 表示 else
      state.elements.push({ element: target, type: 'else', index })

      // 设置事件绑定和动画
      setupElementInteractions(node, element, context)

      effect(() => {
        updateConditionBlock(root, context)
      })

      return node
    }
  }
})

export const elifStatement = defineStatement((source) => {
  return {
    post(context, element, node) {
      const target = node as HTMLElement
      const display = target.style.display
      target.setAttribute('data-original-display', display)

      const root = getConditionBlockRoot(target)
      const state = getOrCreateConditionBlockState(root)

      const conditionRef = ref(false)
      const index = state.conditions.length

      state.conditions.push({ ref: conditionRef, source })
      state.elements.push({ element: target, type: 'elif', index })

      // 设置事件绑定和动画
      setupElementInteractions(node, element, context)

      effect(() => {
        updateConditionBlock(root, context)
      })

      return node
    }
  }
})

registerStatement('if', ifStatement)
registerStatement('else', elseStatement)
registerStatement('elif', elifStatement)
