import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('dot')
  utils.description('A dot (point) on the coordinate plane that can display coordinates or labels.')
  utils.prop('x').describe('The x-coordinate of the dot.').type('number')
  utils.prop('y').describe('The y-coordinate of the dot.').type('number')
  utils.prop('color').describe('The color of the dot.').type('string').optional('"primary"')
  utils.prop('label').describe('Optional label text to display next to the dot (supports LaTeX).').type('string').optional()
  utils.prop('labelColor').describe('The color of the label text.').type('string').optional('color value')
})

