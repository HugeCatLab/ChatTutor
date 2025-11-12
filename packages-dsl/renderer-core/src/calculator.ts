/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Context } from "./context";

export type Calculator<Ctx extends Context> = (context: Ctx) => (...args: any[]) => any
export type CalculatorResult<Cacl extends Calculator<Context>> = ReturnType<ReturnType<Cacl>>

export function defineCalculator<Ctx extends Context>(calculator: Calculator<Ctx>): Calculator<Ctx> {
  return calculator
}

export type CalculatorMap = Map<string, Calculator<Context>>
export const calculators: CalculatorMap = new Map()
export const registerCalculator = <Ctx extends Context>(name: string, calculator: Calculator<Ctx>) => {
  calculators.set(name, calculator as Calculator<Context>)
}
export const getCalculator = (name: string) => {
  return calculators.get(name)
}

registerCalculator('test', defineCalculator(() => {
  return () => 114514
}))
