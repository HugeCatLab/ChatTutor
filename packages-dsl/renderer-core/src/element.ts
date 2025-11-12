export type AttributeValue = string | number | boolean | null | undefined | object | AttributeValue[]
export type EventValue = string
export type StatementValue = string

export type BaseElement<
  Name extends string,
  Attrs extends Record<string, AttributeValue> = Record<string, AttributeValue>,
  > = {
  name: Name
  attrs?: Attrs
  events?: Record<string, EventValue>
  statements?: Record<string, StatementValue>
    children?: (BaseElement<string> | string)[]
  id?: string
    parent?: BaseElement<string>
}