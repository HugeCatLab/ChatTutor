import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('arrow')
  utils.description('An arrow (directed line segment) from one point to another, commonly used to represent vectors.')
  utils.prop('from').describe('The starting point of the arrow.').type('[number, number]')
  utils.prop('to').describe('The ending point of the arrow.').type('[number, number]')
  utils.prop('color').describe('The color of the arrow line and arrowhead.').type('string').optional('"primary"')
})

