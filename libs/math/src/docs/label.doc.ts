import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('label')
  utils.description('A text label positioned at specific coordinates, supports LaTeX mathematical expressions.')
  utils.prop('x').describe('The x-coordinate of the label position.').type('number')
  utils.prop('y').describe('The y-coordinate of the label position.').type('number')
  utils.prop('content').describe('The text content to display, supports LaTeX math expressions.').type('string')
  utils.prop('color').describe('The color of the label text.').type('string').optional('"primary"')
})

