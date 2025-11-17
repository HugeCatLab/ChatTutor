import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('func')
  utils.description('Plots a function y = f(x) over a specified domain, useful for visualizing mathematical functions.')
  utils.prop('value').describe('The function to plot, takes x as input and returns y.').type('(x: number) => number')
  utils.prop('domain').describe('The x-axis range over which to plot the function.').type('[number, number]')
  utils.prop('color').describe('The color of the function curve.').type('string').optional('"primary"')
})

