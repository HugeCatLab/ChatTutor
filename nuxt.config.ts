// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/ui', '@unocss/nuxt'],
  css: [
    '@/assets/css/main.css',
    '@/assets/css/markdown.css',
    'katex/dist/katex.min.css',
    '@dsl/theme-default/styles/main.css',
  ],
  app: {
    head: {
      title: 'ChatTutor — 智能对话式辅助教学',
      titleTemplate: '%s · ChatTutor',
      htmlAttrs: { lang: 'zh-CN' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          hid: 'description',
          name: 'description',
          content: 'ChatTutor：基于 AI 的对话式学习平台，支持数学公式渲染与可视化，提供个性化辅导与交互式练习。'
        },
        { property: 'og:title', content: 'ChatTutor — 智能对话式辅助教学' },
        {
          property: 'og:description',
          content: '基于 AI 的对话式学习平台，支持公式渲染（KaTeX）与图形可视化（JSXGraph），为学习者提供个性化辅导体验。'
        },
        { property: 'og:type', content: 'website' },
        { name: 'twitter:card', content: 'summary_large_image' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  ssr: false
})
