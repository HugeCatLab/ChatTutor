/* eslint-disable vue/prefer-import-from-vue */
/* eslint-disable @typescript-eslint/no-explicit-any */
// import { signal } from "alien-signals"
import type { Reactive} from "@vue/reactivity";
import { reactive } from "@vue/reactivity"

export type RawContext = Record<string | symbol, any>
export type Context = Reactive<RawContext>
export const mergeContext = (target: Context, source: Context) => {
  return reactive(Object.assign(target, source));
}

export const createContext = (context: Context) => {
  const getActiveContext = () => reactive(context) as Context
  const setActiveContext = (_context: Context) => {
    context = reactive(_context) as Context
  }
  const clearActiveContext = () => {
    context = reactive({}) as Context
  }
  const withContext = <T>(_context: Context, fn: () => T) => {
    const previousContext = _context
    setActiveContext(_context)
    const result = fn()
    setActiveContext(previousContext)
    return result
  }
  const setValue = (key: string | symbol, value: unknown) => {
    context[key] = value
  }
  const getValue = (key: string | symbol) => {
    return context[key]
  }

  return {
    getActiveContext,
    setActiveContext,
    clearActiveContext,
    withContext,
    setValue,
    getValue,
  }
}

export const Attributes = Symbol('Attributes')
export const Origin = Symbol('Origin')

export function useAttributes<T extends RawContext>(context: Context): Partial<T> {
  return context[Attributes]
}
export function useOrigin(context: Context) {
  return context[Origin]
}
