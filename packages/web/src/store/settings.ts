import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const baseURL = ref(localStorage.getItem('baseURL') ?? '')
  const apiKey = ref(localStorage.getItem('apiKey') ?? '')
  const agentModel = ref(localStorage.getItem('agentModel') ?? '')
  const titleModel = ref(localStorage.getItem('titleModel') ?? '')

  const persist = (key: string, value: string) => {
    localStorage.setItem(key, value)
  }

  const saveSettings = () => {
    persist('baseURL', baseURL.value)
    persist('apiKey', apiKey.value)
    persist('agentModel', agentModel.value)
    persist('titleModel', titleModel.value)
  }

  return {
    baseURL,
    apiKey,
    agentModel,
    titleModel,
    saveSettings,
  }
})