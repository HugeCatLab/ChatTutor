import type { Context } from "./context"
import type { BaseElement } from "./element"

export type StatementPostGenerator = (
  context: Context,
  element: BaseElement<string>,
  node: Node
) => Node
export type StatementPreGenerator = (
  context: Context,
  element: BaseElement<string>,
  resolve: (element: BaseElement<string> | string, contextOverride?: Context) => Node | Node[] | null
) => Node[]
export type Statement = (source: string) => {
  pre?: StatementPreGenerator
  post?: StatementPostGenerator
}

export function defineStatement(statement: Statement): Statement {
  return statement
}
export type StatementMap = Map<string, Statement>
export const statementMap: StatementMap = new Map()

export function registerStatement(name: string, statement: Statement) {
  statementMap.set(name, statement)
}

export function getStatement(name: string) {
  return statementMap.get(name)
}