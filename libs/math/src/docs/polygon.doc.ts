import { definePrefabKnowledge } from '@dsl/knowledge'

export default definePrefabKnowledge((utils) => {
  utils.name('polygon')
  utils.description('Draws a polygon or polyline connecting multiple points. Can be filled (graph type) or just outline (line type).')
  utils.prop('type').describe('The rendering type: "graph" for filled polygon with transparency, "line" for outline only.').type('"graph" | "line"')
  utils.prop('points').describe('An array of coordinate points to connect.').type('[number, number][]')
  utils.prop('color').describe('The color of the polygon stroke and fill (if graph type).').type('string').optional('"primary"')
})

