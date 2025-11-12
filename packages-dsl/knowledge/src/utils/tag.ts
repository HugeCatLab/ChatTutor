import type { CalculatorKnowledge } from "../calculator";
import type { PrefabKnowledge } from "../prefab";

export const getTags = (prefabs: PrefabKnowledge[]) => {
  return prefabs.map((prefab) => prefab.tags).flat()
}

export const getPrefabsByTag = (prefabs: PrefabKnowledge[], tag: string) => {
  return prefabs.filter((prefab) => prefab.tags.includes(tag))
}

export const getCalculators = (calculators: CalculatorKnowledge[]) => {
  return calculators.map((calculator) => [calculator.name, calculator.description])
}
