export const useSettings = () => {
  const baseURL = ref<string>('')
  const apiKey = ref<string>('')
  const agentModel = ref<string>('')
  const painterModel = ref<string>('')
  const titleModel = ref<string>('')

  const saveBaseURL = (baseURL: string) => {
    localStorage.setItem('baseURL', baseURL)
  }
  const saveAPIKey = (apiKey: string) => {
    localStorage.setItem('apiKey', apiKey)
  }
  const saveAgentModel = (agentModel: string) => {
    localStorage.setItem('agentModel', agentModel)
  }
  const savePainterModel = (painterModel: string) => {
    localStorage.setItem('painterModel', painterModel)
  }
  const saveTitleModel = (titleModel: string) => {
    localStorage.setItem('titleModel', titleModel)
  }

  const saveSettings = () => {
    saveBaseURL(baseURL.value)
    saveAPIKey(apiKey.value)
    saveAgentModel(agentModel.value)
    savePainterModel(painterModel.value)
    saveTitleModel(titleModel.value)
  }

  const loadSettings = () => {
    baseURL.value = localStorage.getItem('baseURL') ?? ''
    apiKey.value = localStorage.getItem('apiKey') ?? ''
    agentModel.value = localStorage.getItem('agentModel') ?? ''
    painterModel.value = localStorage.getItem('painterModel') ?? ''
    titleModel.value = localStorage.getItem('titleModel') ?? ''
  }

  onMounted(() => {
    loadSettings()
  })

  return {
    baseURL,
    apiKey,
    agentModel,
    painterModel,
    titleModel,
    saveSettings,
    loadSettings,
    saveBaseURL,
    saveAPIKey,
    saveAgentModel,
    savePainterModel,
    saveTitleModel,
  }
}