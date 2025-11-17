import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('line')
  utils.description('A straight line segment connecting two points without arrowhead.')
  utils.prop('from').describe('The starting point of the line segment.').type('[number, number]')
  utils.prop('to').describe('The ending point of the line segment.').type('[number, number]')
  utils.prop('color').describe('The color of the line.').type('string').optional('"primary"')
})

