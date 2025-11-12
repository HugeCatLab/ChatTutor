import type { BaseElement } from "./element"

export interface RendererError<T extends string> {
  name: T
  message: string
  element: BaseElement<string>
}

export function createErrorContainer<T extends string>() {
  const errors: RendererError<T>[] = []
  let errorHandler: (error: RendererError<T>) => void = () => { }
  const addError = (error: RendererError<T>) => {
    errors.push(error)
    errorHandler(error)
  }
  const onError = (handler: (error: RendererError<T>) => void) => {
    errorHandler = handler
  }
  const getErrors = () => errors
  const clearErrors = () => {
    errors.length = 0
  }
  return { addError, onError, getErrors, clearErrors }
}