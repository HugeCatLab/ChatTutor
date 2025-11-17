import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('parameter')
  utils.description('Plots a parametric curve defined by (x(t), y(t)) over a parameter range, useful for circles, spirals, and other parametric equations.')
  utils.prop('value').describe('The parametric function that takes parameter t and returns [x, y] coordinates.').type('(t: number) => [number, number]')
  utils.prop('domain').describe('The parameter range [t_min, t_max] over which to plot the curve.').type('[number, number]')
  utils.prop('color').describe('The color of the parametric curve.').type('string').optional('"primary"')
})

