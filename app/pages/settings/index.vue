<script setup lang="ts">
import type { LocaleObject } from '@nuxtjs/i18n'

const { t, locale, locales, setLocale } = useI18n()

const titleStyle = 'font-mono flex text-center select-none'

const { baseURL, apiKey, agentModel, titleModel, saveBaseURL, saveAPIKey, saveAgentModel, saveTitleModel } = useSettings()

const availableLocales = computed(() => {
  return locales.value.map((l: LocaleObject) => [l.name, l.code]) as [string, string][]
})
const supportedLocales = computed(() => {
  return locales.value.map((l: LocaleObject) => l.code)
})

</script>

<template>
  <div class="flex h-[100vh] w-full flex-col items-center p-5 overflow-y-auto relative">
    <div class="flex flex-col md:w-2/3 p-10 gap-10">
      <h1 :class="titleStyle" class="text-xl md:text-2xl dark:text-gray-300">
        {{ t('settings.title') }}
      </h1>

      <div class="w-full flex flex-col gap-5">
        <h2 :class="titleStyle" class="text-md md:text-lg text-gray-500 dark:text-gray-400">
          {{ t('settings.models.title') }}
        </h2>
        <div class="flex flex-col gap-3">
          <InputArea type="text" :label="t('settings.models.baseURL')"
            placeholder="https://api.openai.com/v1" v-model="baseURL" @save="saveBaseURL" />
          <InputArea type="password" :label="t('settings.models.apiKey')"
            :description="t('settings.models.apiKeyDescription')" v-model="apiKey" @save="saveAPIKey" />
          <InputArea type="text" :label="t('settings.models.agentModel')" v-model="agentModel" @save="saveAgentModel" />
          <InputArea type="text" :label="t('settings.models.titleModel')"
            :description="t('settings.models.titleModelDescription')" :placeholder="agentModel" v-model="titleModel"
            @save="saveTitleModel" />
        </div>
        <h2 :class="titleStyle" class="text-md md:text-lg text-gray-500 dark:text-gray-400">
          {{ t('settings.interface.title') }}
        </h2>
        <SelectArea v-model="$colorMode.preference" :label="t('settings.interface.colorMode')"
          :options="[[t('settings.interface.colorModeOptions.light'), 'light'], [t('settings.interface.colorModeOptions.dark'), 'dark'], [t('settings.interface.colorModeOptions.system'), 'system']]" />
        <SelectArea :model-value="locale" :label="t('settings.interface.language')" :options="availableLocales"
          @update:model-value="(locale) => {
            if (!locale) return;
            setLocale(locale as typeof supportedLocales[number])
          }"/>
      </div>
    </div>
  </div>
</template>
