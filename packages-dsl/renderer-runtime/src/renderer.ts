import type { RootDocument, BaseElement, StatementPreGenerator, StatementPostGenerator, PrefabGeneratorContext, PrefabDefinition, RawContext, PrefabParseType } from '@dsl/renderer-core'
import { createContext, createAdhoc, effect, mergeContext, toProps, reactive, getRootSpace, ref, createErrorContainer, getStatement, Attributes, Origin } from '@dsl/renderer-core'
import { createDelegate } from './delegate'
import { createMarkdown } from './builtins/markdown'
import patch from 'morphdom'
import { createParser } from './parser'
import { createAnimate } from '@dsl/animation'

export const toArray = <T>(value: T | T[]): T[] => Array.isArray(value) ? value : [value]

export function createRenderer() {
  const { getActiveContext, setActiveContext, clearActiveContext, withContext, setValue, getValue } = createContext(reactive({}))
  const errors = createErrorContainer()
  const { parse } = createParser({ space: getRootSpace() })
  const markdown = createMarkdown()
  const indexQueue = new Map<number, (() => void)[]>()
  const indexStatus = new Map<number, boolean>()

  const mountQueue: (() => void)[] = []
  const onMount = (callback: () => void) => {
    mountQueue.push(callback)
  }

  let availableAnimations: Record<string, Animation | Animation[]> = {}

  const preprocessElement = (elements: (BaseElement<string> | string)[]) => {
    const mergedChildren: (BaseElement<string> | string)[] = []
    let currentStringGroup: string[] = []

    for (const child of elements) {
      if (typeof child === 'string') {
        currentStringGroup.push(child)
      } else {
        if (currentStringGroup.length > 0) {
          mergedChildren.push(currentStringGroup.join(''))
          currentStringGroup = []
        }
        if (typeof child === 'object' && child !== null && 'children' in child) {
          child.children = preprocessElement(child.children ?? [])
        }
        mergedChildren.push(child)
      }
    }

    if (currentStringGroup.length > 0) {
      mergedChildren.push(currentStringGroup.join(''))
    }

    return mergedChildren
  }


  const renderRootDocument = (doc: RootDocument, parsetype: PrefabParseType = 'node'): Node | Node[] | null => {
    if (!doc.root) {
      return document.createTextNode('')
    }
    if (doc.animations) {
      availableAnimations = doc.animations
    } else availableAnimations = {}
    const roots = preprocessElement(toArray(doc.root))
    const refs = Object.entries(doc.refs ?? {})
    const retryWaitlist: string[] = []
    const resolve = (key: string, value: string, retrying: boolean = false) => {
      const _ref = ref()
      setValue(key, _ref)
      const update = () => {
        try {
          _ref.value = createAdhoc(getActiveContext())(value)
          if (retryWaitlist.includes(key)) {
            retryWaitlist.splice(retryWaitlist.indexOf(key), 1)
          }
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
          if (retrying) return
          retryWaitlist.push(key)
        }
        if (retrying) return
        for (const key of retryWaitlist) {
          resolve(key, doc.refs![key], true)
        }
      }
      update()
      effect(update)
    }
    for (const reflection of refs) {
      const [key, value] = reflection
      resolve(key, value)
    }

    // Set up default values to prevent undefined access
    return roots.flatMap(root => {
      if (typeof root === 'string') {
        return renderText(root, parsetype)
      }
      root.attrs ??= {}
      root.events ??= {}
      root.statements ??= {}
      root.children ??= []

      const attrs = toProps(root.attrs, getActiveContext())
      return withContext(
        mergeContext(getActiveContext(), attrs),
        (): Node | Node[] | null => renderElement(root!)
      )
    }) as Node[]
  }

  const renderPrefab = (
    element: BaseElement<string>,
    props: RawContext,
    { name, validator, generator, provides, defaults }: PrefabDefinition<string>,
    parsetype: PrefabParseType = 'node'
  ) => {
    // Set up default values to prevent undefined access
    element.attrs ??= {}
    element.events ??= {}
    element.statements ??= {}
    element.children ??= []

    if (validator) {
      if (!validator()) {
        return null
      }
    }

    const delegate = (node: Node, events: Record<string, string | (() => void)>) => {
      const _delegate = createDelegate(node, getActiveContext())
      Object.entries(events).forEach(([event, handler]) => {
        _delegate(event, handler)
      })
      return _delegate
    }
    const statementResolvers: { pre?: StatementPreGenerator, post?: StatementPostGenerator }[]
      = Object.entries(element.statements ?? {}).map(([key, value]) => {
        const statement = getStatement(key)
        if (!statement) {
          if (key.startsWith('#')) return null
          errors.addError({ name: 'Statement Not Found', message: `Statement ${key} not found`, element })
          return null
        }
        return statement(value)
      }).filter(Boolean) as { pre?: StatementPreGenerator, post?: StatementPostGenerator }[]

    for (const { pre } of statementResolvers) {
      if (!pre) continue
      return pre(getActiveContext(), element, (element, contextOverride) => {
        if (contextOverride) {
          return withContext(contextOverride, () => renderNode(element, parsetype))
        }
        return renderNode(element, parsetype)
      })
    }

    const children = withContext(
      mergeContext(getActiveContext(), provides ?? {}),
      () => (element.children ?? []).flatMap(child => renderNode(child, parsetype)).filter(child => child !== null && child !== undefined)
    )

    const generatorContext: PrefabGeneratorContext = {
      mount: onMount,
    }

    const node = generator(
      { ...defaults, ...props },
      () => children, generatorContext)
    for (const { post } of statementResolvers) {
      if (!post) continue
      return post(getActiveContext(), element, node)
    }
  
    const animate = createAnimate({ node, prefab: name, context: getActiveContext(), animations: availableAnimations })
    setValue('animate', animate)

    delegate(node, element.events)

    const update = () => {
      element.attrs ??= {}
      element.events ??= {}
      element.children ??= []
      const attrs = toProps(element.attrs, getActiveContext())
      const fakeContext: PrefabGeneratorContext = {
        mount: () => { }
      }
      const newNode = generator({ ...defaults, ...attrs }, () => children, fakeContext)
      delegate(newNode, element.events)
      patch(node, newNode)
      return newNode
    }
    effect(update)

    return node
  }

  const renderElement = (element: BaseElement<string>): Node | Node[] | null => {
    const pfbs = getRootSpace()
    const pfb = pfbs.get(element.name)
    if (!pfb) {
      return null
    }

    element.attrs ??= {}

    const props = toProps<{ index?: number | string }>(element.attrs, getActiveContext())
    const resolve = () => {
      setValue(Attributes, props)
      setValue(Origin, element)

      const maybePromise = pfb.prefab(getActiveContext(), errors.addError)
      if (maybePromise instanceof Promise) {
        const fragment = document.createElement('div')
        onMount(() => {
          maybePromise.then((definition) => {
            const parent = fragment.parentElement
            const nodes = toArray(renderPrefab(element, props, definition))
            for (const node of nodes) {
              if (!node || !parent) continue
              parent.insertBefore(node, parent.firstChild)
            }
          })
        })
        return fragment
      }
      return renderPrefab(element, props, maybePromise, pfb.type)
    }
    if (!props.index) return resolve()
    const fragment = document.createElement('div')
    const index = Number(props.index)
    const l = indexQueue.get(index) ?? []
    l.push(() => {
      const nodes = toArray(resolve())
      for (const node of nodes) {
        if (!node || !fragment.parentElement) continue
        fragment.parentElement.insertBefore(node, fragment.parentElement.firstChild)
      }
    })
    indexQueue.set(index, l)
    indexStatus.set(index, false)
    return fragment
  }

  const renderValue = (source: string) => {
    const [, _] = source.split('{{')
    const [key] = _.split('}}')
    return _renderValue(key)
  }

  const _renderValue = (source: string) => {
    const adhoc = createAdhoc(getActiveContext())
    return adhoc(source)
  }

  const renderText = (source: string, parsetype: PrefabParseType = 'node') => {
    const text = document.createElement('span')
    effect(() => {
      // We shouldn't remove newlines in some situations because it may affect markdown content.
      const substitutionPattern = parsetype === 'node' ? /{{(.*?)}}/g : /\n*{{(.*?)}}\n*/g
      const value = source.replace(substitutionPattern, (match, key) => {
        return String(_renderValue(key)).trim()
      })
      if (parsetype === 'node') {
        markdown(value).then(result => {
          text.innerHTML = result.toString()
        })
      } else {
        text.innerHTML = value
      }
    })
    return text
  }

  const renderNode = (element: BaseElement<string> | string, parsetype: PrefabParseType = 'node') => {
    if (typeof element === 'string') {
      return renderText(element, parsetype)
    }
    return renderElement(element)
  }

  const renderRoot = (root: RootDocument) => {
    return renderRootDocument(root)
  }

  const mount = () => {
    for (const callback of mountQueue) {
      callback()
    }
    mountQueue.length = 0
  }

  const safeMount = (container: HTMLElement) => {
    let mounted = false
    let resizeObserver: ResizeObserver | null = null

    const doMount = () => {
      if (mounted) return
      mounted = true
      if (resizeObserver) {
        resizeObserver.disconnect()
        resizeObserver = null
      }
      mount()
    }

    const checkAndMount = () => {
      const rect = container.getBoundingClientRect()
      // Check if container has valid dimensions
      if (rect.width > 0 && rect.height > 0) {
        doMount()
        return true
      }
      return false
    }

    // Try immediate mount first (for reload cases where layout is already calculated)
    if (checkAndMount()) {
      return
    }

    // For real-time rendering, use ResizeObserver to wait for valid dimensions
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          doMount()
          break
        }
      }
    })

    resizeObserver.observe(container)

    // Fallback: if ResizeObserver doesn't fire within reasonable time, try mount anyway
    setTimeout(() => {
      if (!mounted && resizeObserver) {
        doMount()
      }
    }, 1000)
  }

  const render = (document: string, element?: HTMLElement) => {
    const parsed = parse(document)
    if (!parsed) return
    const nodes = toArray(renderRootDocument(parsed))
    if (element) {
      element.childNodes.forEach(child => child.remove())
      element.append(...nodes.filter(node => node !== null && node !== undefined))
      safeMount(element)
    }
    return [mount, indexRender] as [
      () => void,
      (index: number) => void
    ]
  }

  const indexRender = (index: number) => {
    for (let i = 1; i <= index; i++) {
      if (indexStatus.get(i)) continue
      indexStatus.set(i, true)
      const l = indexQueue.get(i) ?? []
      for (const callback of l) {
        callback()
      }
    }
  }

  return {
    ...errors,
    render,
    renderRoot,
    renderElement,
    renderRootDocument,
    renderNode,
    renderText,
    renderValue,
    indexRender,
    getActiveContext,
    setActiveContext,
    clearActiveContext,
    setValue,
    getValue,
    onMount,
    mount,
  }
}
