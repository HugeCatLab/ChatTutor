import { calculators } from "./calculator"
import type { Context } from "./context"
import type { AttributeValue } from "./element"

export function createAdhoc(context: Context) {
  return (src: string, o?: Context) => {
    calculators.entries().map(([name, calculator]) => {
      return [name, calculator(context)]
    }).forEach((t) => {
      (o ?? context)[t[0] as string] = t[1]
    })
    return new Function(`return (function($__ctx){with($__ctx){return (${src});}});`)()(o ?? context)
  }
}

export function toProp(key: string, source: AttributeValue, context: Context) {
  const _computed = (source: string) => {
    try {
      return createAdhoc(context)(source)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return source
    }
  }
  const _string = (source: string) => {
    return key.startsWith(':') || (source.startsWith('[') && source.endsWith(']')) || source.startsWith('{') && source.endsWith('}')
      ? _computed(source)
      : source
  }
  const _common = (source: number | boolean | null | undefined) => source
  const _array = (sources: AttributeValue[]) => {
    return [...sources.map((source) => toProp(key, source, context))]
  }
  const _object = (source: Record<string, AttributeValue>) => {
    return Array.isArray(source)
      ? _array(source as unknown as AttributeValue[])
      : Object.fromEntries(Object.entries(source).map(([key, value]) => [key, toProp(key, value, context)]))
  }
    
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const typeMap = new Map<string, (source: any) => unknown>()
  typeMap.set('string', _string)
  typeMap.set('number', _common)
  typeMap.set('boolean', _common)
  typeMap.set('null', _common)
  typeMap.set('undefined', _common)
  typeMap.set('object', _object)
  return typeMap.get(typeof source)?.(source)
}

export function toProps<T extends Record<string, unknown> = Record<string, unknown>>(attrs: Record<string, AttributeValue>, context: Context): T & { [key: string]: unknown } {
  return Object.fromEntries(Object.entries(attrs).map(([key, value]) => [key.replace(/^:/, ''), toProp(key, value, context)])) as T & { [key: string]: unknown }
}
