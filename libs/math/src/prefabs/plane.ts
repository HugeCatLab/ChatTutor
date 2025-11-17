import { tag } from '@dsl/utils-canvas'
import { definePrefab, ref, registerPrefab } from '@dsl/renderer-core'
import type { Vector2 } from '../utils'
import { theme } from '@dsl/utils-theme'

export interface PlaneAttributes {
  range: Vector2
  domain: Vector2
  axis: boolean
  grid: boolean
  flexible: boolean
}

export const plane = definePrefab<'plane', PlaneAttributes>(() => {
  const aspectWidth = ref(1)
  const aspectHeight = ref(-1)
  return {
    name: 'plane',
    generator(attrs, children, { mount }) {
      const { range, domain } = attrs
      const container = document.createElement('div')
      const canvas = tag('svg')
      const width = domain[1] - domain[0]
      const height = range[1] - range[0]
      const contentAspectRatio = width / height
      canvas.attr('width', '100%')
      canvas.attr('height', '100%')
      container.style.display = 'flex'

      // 更新布局的函数
      const updateLayout = () => {
        const parent = container.parentElement
        if (!parent) return

        const { width: parentWidth, height: parentHeight } = parent.getBoundingClientRect()
        if (parentWidth === 0 || parentHeight === 0) return

        const parentAspectRatio = parentWidth / parentHeight

        // 重置样式
        container.style.width = ''
        container.style.height = ''
        container.style.aspectRatio = ''
        container.style.justifyContent = ''
        container.style.alignItems = ''

        if (contentAspectRatio > parentAspectRatio) {
          // 内容相对更宽，以宽度为基准，垂直居中
          container.style.width = '100%'
          container.style.aspectRatio = `${width / height}`
          container.style.alignItems = 'center'
        } else {
          // 内容相对更高，以高度为基准，水平居中
          container.style.height = '100%'
          if (attrs.flexible) {
            container.style.width = '100%'
            // container.style.aspectRatio = `${1 / height}`
          } else {
            container.style.aspectRatio = `${width / height}`
          }
          container.style.justifyContent = 'center'
        }
      }

      const root = tag('g')
      canvas.append(root.node())

      const xAxis = tag('line')
      const yAxis = tag('line')

      // 更新 canvas 尺寸和坐标轴位置的函数
      const updateCanvas = () => {
        const c = canvas.node()
        const { width: w, height: h } = c.getBoundingClientRect()
        if (w > 0 && h > 0) {
          c.setAttribute('width', `${w}`)
          c.setAttribute('height', `${h}`)
          root.attr('transform', `translate(${w * ((0 - domain[0]) / width)}, ${h * (range[1] / height)})`)

          aspectWidth.value = w / width
          aspectHeight.value = -h / height

          xAxis.attr('x1', `${aspectWidth.value * domain[0]}`)
          xAxis.attr('x2', `${aspectWidth.value * domain[1]}`)
          xAxis.attr('y1', '0')
          xAxis.attr('y2', '0')
          yAxis.attr('x1', '0')
          yAxis.attr('x2', '0')
          yAxis.attr('y1', `${aspectHeight.value * range[0]}`)
          yAxis.attr('y2', `${aspectHeight.value * range[1]}`)
        }
      }
      const xTicks = tag('g')
      const yTicks = tag('g')
      const grid = tag('g')
      if (attrs.axis) {
        xAxis.attr('stroke', theme.pallete('primary'))
        xAxis.attr('stroke-width', '2')
        yAxis.attr('stroke', theme.pallete('primary'))
        yAxis.attr('stroke-width', '2')

        // ticks
        xTicks.attr('stroke', theme.pallete('primary'))
        xTicks.attr('stroke-width', '2')
        yTicks.attr('stroke', theme.pallete('primary'))
        yTicks.attr('stroke-width', '2')
        for (let i = -9; i <= 10; i += 1) {
          const tickX = tag('line')
          tickX.attr('x1', `${i * 10}%`)
          tickX.attr('y1', '-10')
          tickX.attr('x2', `${i * 10}%`)
          tickX.attr('y2', '10')
          xTicks.append(tickX.node())
          const tickY = tag('line')
          tickY.attr('x1', '-10')
          tickY.attr('y1', `${i * 10}%`)
          tickY.attr('x2', '10')
          tickY.attr('y2', `${i * 10}%`)
          yTicks.append(tickY.node())
        }

        root.append(xTicks.node())
        root.append(yTicks.node())
        root.append(xAxis.node())
        root.append(yAxis.node())
      }
      if (attrs.grid) {
        grid.attr('stroke', theme.pallete('primary'))
        grid.attr('stroke-width', '1')
        for (let i = -10; i <= 10; i += 1) {
          const gridX = tag('line')
          gridX.attr('x1', `${i * 10}%`)
          gridX.attr('y1', '-100%')
          gridX.attr('x2', `${i * 10}%`)
          gridX.attr('y2', '100%')
          grid.append(gridX.node())
          const gridY = tag('line')
          gridY.attr('x1', '-100%')
          gridY.attr('y1', `${i * 10}%`)
          gridY.attr('x2', '100%')
          gridY.attr('y2', `${i * 10}%`)
          grid.append(gridY.node())
        }
        root.append(grid.node())
      }

      mount(() => {
        // 初始化布局
        updateLayout()
        updateCanvas()

        // 监听父容器尺寸变化
        const parent = container.parentElement
        if (parent) {
          const resizeObserver = new ResizeObserver(() => {
            updateLayout()
            // 使用 requestAnimationFrame 确保布局更新后再计算 canvas 尺寸
            requestAnimationFrame(() => {
              updateCanvas()
            })
          })
          resizeObserver.observe(parent)
        }
      })

      container.appendChild(canvas.node())

      root.node().append(...children())
      
      return container
    },
    defaults: {
      axis: true,
      grid: true,
      flexible: true,
    },
    provides: {
      aspectWidth,
      aspectHeight,
    }
  }
})

export type PlaneProvides = {
  aspectWidth: number
  aspectHeight: number
}

registerPrefab('plane', plane)
