import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('angle')
  utils.description('An angle marker between two rays from a common origin. For 90-degree angles, displays as a right angle corner; otherwise shows as a filled arc.')
  utils.prop('start').describe('The point on the starting ray (defines the first side of the angle).').type('[number, number]')
  utils.prop('end').describe('The point on the ending ray (defines the second side of the angle).').type('[number, number]')
  utils.prop('origin').describe('The vertex point where both rays originate.').type('[number, number]')
  utils.prop('color').describe('The color of the angle marker and fill.').type('string').optional('"primary"')
  utils.prop('label').describe('Optional label to display near the angle (supports LaTeX).').type('string').optional()
})

