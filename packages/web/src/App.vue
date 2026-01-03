<template>
  <RouterView />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSettingsStore } from './store/settings'

onMounted(() => {
  const settings = useSettingsStore()
  settings.applyColorMode()
  settings.applyLanguage()
})
</script>