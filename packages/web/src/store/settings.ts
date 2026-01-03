import { usePreferredDark, usePreferredLanguages } from '@vueuse/core'
import { defineStore } from 'pinia'
import { computed, watch } from 'vue'
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

export type ColorMode = 'light' | 'dark' | 'system';

export const modelProviders = {
  openai: {
    label: 'OpenAI',
    baseURL: 'https://api.openai.com/v1',
  },
  anthropic: {
    label: 'Anthropic',
    baseURL: 'https://api.anthropic.com/v1',
  },
  deepseek: {
    label: 'DeepSeek',
    baseURL: 'https://api.deepseek.com/v1',
  },
}

export const useSettingsStore = defineStore('settings', () => {
  const browserDark = usePreferredDark()
  const browserLanguages = usePreferredLanguages()
  const { locale, t } = useI18n()

  const preferZh = computed(() =>
    browserLanguages.value.some(
      (lang) => lang.startsWith('zh') || lang.startsWith('cn')
    )
  )

  const baseURL = ref(localStorage.getItem('baseURL') || '')
  const apiKey = ref(localStorage.getItem('apiKey') || '')
  const agentModel = ref(localStorage.getItem('agentModel') || '')
  const titleModel = ref(localStorage.getItem('titleModel') || '')
  const language = ref(
    localStorage.getItem('language') || (preferZh.value ? 'zh' : 'en')
  )
  const colorMode = ref(
    (localStorage.getItem('colorMode') as ColorMode) || 'system'
  )
  const modelProvider = ref(
    (localStorage.getItem('modelProvider') as keyof typeof modelProviders) ||
      'openai'
  )
  const modelProviderDetails = computed(
    () => modelProviders[modelProvider.value]
  )

  const persist = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  const saveSettings = () => {
    persist('baseURL', baseURL.value)
    persist('apiKey', apiKey.value)
    persist('agentModel', agentModel.value)
    persist('titleModel', titleModel.value)
    persist('colorMode', colorMode.value)
    persist('modelProvider', modelProvider.value)
    persist('language', language.value)
  }

  watch(
    [
      baseURL,
      apiKey,
      agentModel,
      titleModel,
      colorMode,
      modelProvider,
      language,
    ],
    saveSettings
  )

  const isDarkMode = computed(() => {
    if (colorMode.value === 'dark') return true
    if (colorMode.value === 'light') return false
    return browserDark.value
  })

  const applyColorMode = () => {
    document.documentElement.classList.toggle('dark', isDarkMode.value)
  }

  watch(isDarkMode, applyColorMode)

  const applyLanguage = () => {
    locale.value = language.value
    document.title = t('common.chatTutor') + ' - ' + t('common.desc')
  }
  watch(language, applyLanguage)

  return {
    baseURL,
    apiKey,
    agentModel,
    titleModel,
    colorMode,
    isDarkMode,
    language,
    modelProvider,
    modelProviderDetails,
    applyColorMode,
    applyLanguage,
  }
})
