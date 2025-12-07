<script setup lang="ts">
const titleStyle = 'font-mono flex text-center select-none'

const { baseURL, apiKey, agentModel, painterModel, titleModel, saveBaseURL, saveAPIKey, saveAgentModel, savePainterModel, saveTitleModel } = useSettings()
</script>

<template>
  <div class="flex h-[100vh] w-full flex-col items-center p-5 overflow-scroll relative">
    <div class="flex flex-col md:w-2/3 p-10 gap-10">
      <h1
        :class="titleStyle"
        class="text-xl md:text-2xl dark:text-gray-300"
      >
        Settings
      </h1>

      <div class="w-full flex flex-col gap-5">
        <h2
          :class="titleStyle"
          class="text-md md:text-lg text-gray-500 dark:text-gray-400"
        >
          Models
        </h2>
        <div class="flex flex-col gap-3">
          <InputArea
            type="text"
            label="Base URL"
            :model="baseURL"
            @save="saveBaseURL"
          />
          <InputArea
            type="password"
            label="API Key"
            description="The information is stored in your browser's local storage."
            :model="apiKey"
            @save="saveAPIKey"
          />
          <InputArea
            type="text"
            label="Agent Model"
            :model="agentModel"
            @save="saveAgentModel"
          />
          <InputArea
            type="text"
            label="Painter Model"
            description="Optional, default to the same as Agent Model."
            :model="painterModel"
            @save="savePainterModel"
          />
          <InputArea
            type="text"
            label="Title Model"
            description="Optional, default to the same as Agent Model."
            :model="titleModel"
            @save="saveTitleModel"
          />
        </div>
        <h2
          :class="titleStyle"
          class="text-md md:text-lg text-gray-500 dark:text-gray-400"
        >
          Interface
        </h2>
      </div>
    </div>
  </div>
</template>
