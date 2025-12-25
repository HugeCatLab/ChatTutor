<script setup lang="ts">
defineProps<{
  disabled?: boolean
}>()
</script>

<template>
  <button 
    :disabled="disabled"
    class="disabled:opacity-50 disabled:cursor-not-allowed select-none hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg p-2 hover:transition-all duration-300 text-gray-500 dark:text-gray-400">
    <slot/>
  </button>
</template>
