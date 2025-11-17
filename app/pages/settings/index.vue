<script setup lang="ts">
const titleStyle = 'font-mono flex text-center select-none'

const { baseURL, apiKey, agentModel, painterModel, titleModel, saveBaseURL, saveAPIKey, saveAgentModel, savePainterModel, saveTitleModel } = useSettings()
</script>

<template>
  <div class="size-full flex flex-col justify-center items-center p-5">
    <div class="flex flex-col w-2/3 p-10 gap-10">
      <h1
        :class="titleStyle"
        class="text-xl md:text-2xl"
      >
        Settings
      </h1>

      <div class="w-full flex flex-col gap-5">
        <h2
          :class="titleStyle"
          class="text-md md:text-lg text-gray-500"
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
      </div>
    </div>
  </div>
</template>
