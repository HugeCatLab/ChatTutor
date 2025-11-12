import { parseAnimation } from "@dsl/animation";
import type { Animation, BaseElement, Component } from "@dsl/renderer-core";
import type { AttributeNode, BaseNode, ElementNode, ParseOptions, TextNode, ValueNode } from "@dsl/x-parser";
import { NodeType, parse } from "@dsl/x-parser";
import { load } from 'js-yaml'

export function parseXAttribute(attribute: AttributeNode) {
  const type =
    attribute.name.startsWith(':') ? 'expression'
      // : attribute.name.startsWith('&') ? 'animation'
      : attribute.name.startsWith('@') ? 'event'
        : attribute.name.startsWith('#') ? 'statement'
          : 'string'
  switch (type) {
    case 'expression': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    // case 'animation': {
    //   return {
    //     type,
    //     value: attribute.value,
    //     key: attribute.name,
    //   }
    // }
    case 'event': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    case 'statement': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
    case 'string': {
      return {
        type,
        value: attribute.value,
        key: attribute.name,
      }
    }
  }
}

export function parseXNode(node: BaseNode, parent: BaseElement<string> | null = null): BaseElement<string> | string {
  if (node.type === NodeType.ELEMENT) {
    const element: BaseElement<string> = {
      name: (<ElementNode>node).tag,
      id: `${(<ElementNode>node).tag}-${crypto.randomUUID()}`,
    }
    element.attrs ??= {}
    element.events ??= {}
    element.statements ??= {}
    element.children ??= []
    element.parent = parent ?? undefined
    for (const attribute of (<ElementNode>node).attributes) {
      const attr = parseXAttribute(attribute)
      if (attr.type === 'expression' || attr.type === 'string') {
        element.attrs[attr.key] = attr.value
      }
      else if (attr.type === 'event') {
        element.events[attr.key.slice(1)] = attr.value
      }
      else if (attr.type === 'statement') {
        element.statements[attr.key.slice(1)] = attr.value
      }
    }
    for (const child of (<ElementNode>node).children) {
      element.children.push(parseXNode(child, element))
    }
    return element
  }
  else if (node.type === NodeType.TEXT) {
    const textNode = node as TextNode
    // Don't trim text nodes - preserve whitespace for proper markdown rendering
    return textNode.content
  }
  else if (node.type === NodeType.VALUE) {
    return `{{ ${(node as ValueNode).value} }}`
  }
  return ''
}

export function parseX(content: string, options: ParseOptions): (BaseElement<string> | string)[] {
  const { children } = parse(content, options)
  return children.map((child) => parseXNode(child, null))
}

// Match YAML frontmatter: must start at beginning of line or string
// This prevents matching markdown table separators like |------|------|
const COMPONENT_INFO_REG = /^---\n[\s\S]*?\n---$/gm
export function parseComponentInfo(content: string): { name: string, props: string[], refs: Record<string, string>, animations: Record<string, Animation[] | Animation> } {
  const match = content.match(COMPONENT_INFO_REG)
  if (match) {
    const info = match[0].trim().slice(3, -3)
    const { name, props, refs, animations } = load(info) as { name: string, props: string[], refs: Record<string, string>, animations: Record<string, string | string[]> }
    return {
      name,
      props,
      refs,
      animations: animations ?
        Object.fromEntries(
          Object.entries(animations)
            .map(([key, value]) => [
              key,
              Array.isArray(value)
                ? value.map(parseAnimation).filter((v) => v !== null)
                : parseAnimation(value)]
            )
            .filter(([, value]) => value !== null)
        ) : {}
    }
  }
  return { name: '', props: [], refs: {}, animations: {} }
}

export function parseComponent(content: string, options: ParseOptions): Component<string> {
  const component: Component<string> = {
    name: '',
    props: [],
    refs: {},
  }
  const { name, props, refs, animations } = parseComponentInfo(content)
  component.name = name
  component.props = props
  component.refs = refs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  component.animations = animations as unknown as any
  const template = content.replace(COMPONENT_INFO_REG, '').trim()
  component.root = parseX(template, options)
  return component
}

export * from '@dsl/x-parser'
