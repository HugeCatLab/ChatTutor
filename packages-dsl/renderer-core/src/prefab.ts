import type { RawContext } from "./context"
import type { RendererError } from "./error"

export type PrefabParseType = 'node' | 'raw'
export type RegisterablePrefab = Prefab<string, RawContext, RawContext> | AsyncPrefab<string, RawContext, RawContext>
export type PrefabNamespace = Map<string, {
  prefab: RegisterablePrefab
  type: PrefabParseType
}>
export type PrefabChildrenGetter = () => Node[]
export type PrefabValidator = () => boolean
export type PrefabGeneratorMount = (callback: () => void) => void
export type PrefabGeneratorContext = {
  mount: PrefabGeneratorMount
}
export type PrefabGenerator<Props extends RawContext> = (props: Props, children: PrefabChildrenGetter, context: PrefabGeneratorContext) => Node
export type PrefabDefinition<Name extends string, Props extends RawContext = RawContext> = {
  name: Name
  validator?: PrefabValidator
  generator: PrefabGenerator<Props>
  provides?: Record<string | symbol, unknown>
  defaults?: Partial<Props>
  space?: PrefabNamespace
}

export type Prefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  > = (context: Ctx, unexpected: (error: RendererError<string>) => void) => PrefabDefinition<Name, Props>
export type AsyncPrefab<
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
  > = (context: Ctx, unexpected: (error: RendererError<string>) => void) => Promise<PrefabDefinition<Name, Props>>

export const definePrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
>(prefab: Prefab<Name, Props, Ctx>) => prefab

export const defineAsyncPrefab = <
  Name extends string,
  Props extends RawContext = RawContext,
  Ctx extends RawContext = RawContext,
>(prefab: AsyncPrefab<Name, Props, Ctx>) => prefab

const rootSpace: PrefabNamespace = new Map()
export const registerPrefab = <
  T extends RawContext,
  K extends RawContext = RawContext,
>(name: string, prefab: Prefab<string, T, K> | AsyncPrefab<string, T, K>, parseType: PrefabParseType = 'node') => {
  rootSpace.set(name, {
    prefab: prefab as RegisterablePrefab,
    type: parseType,
  })
}
export const getRootSpace = () => rootSpace
