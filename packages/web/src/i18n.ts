import { createI18n } from 'vue-i18n'
import zh from '#/i18n/locales/zh.json'
import en from '#/i18n/locales/en.json'
export default createI18n({
  locale: 'en',
  messages: {
    en,
    zh,
  },
})
