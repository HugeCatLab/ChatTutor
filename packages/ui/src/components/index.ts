import type { App } from 'vue'

const modules = import.meta.glob('./ui/*/index.ts', { eager: true })

export default {
  install(app: App) {
    for (const moduleExports of Object.values<any>(modules)) {
      for (const exportName in moduleExports) {
        const comp = moduleExports[exportName]
        const name = comp?.__name || comp?.name || exportName

        if (!name) {
          continue
        }

        app.component(name, comp)
      }
    }
  },
}
