import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('plane')
  utils.description('The plane is a two-dimensional space that is used to represent the coordinate system.')
  utils.prop('range').describe('The range of the plane.').type('[number, number]')
  utils.prop('domain').describe('The domain of the plane.').type('[number, number]')
  utils.prop('axis').describe('Whether to show the axis.').type('boolean').optional('true')
  utils.prop('grid').describe('Whether to show the grid.').type('boolean').optional('true')
})