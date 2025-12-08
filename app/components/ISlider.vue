<script setup lang="ts">
import type { SliderForm } from '@chat-tutor/shared'

const props = defineProps<SliderForm>()

const emit = defineEmits<{
  (e: 'update:value', value: number): void
}>()

const modelValue = computed({
  get: () => props.value,
  set: (val) => emit('update:value', val)
})
</script>

<template>
  <div class="flex flex-col w-full gap-2 py-2">
    <div class="flex justify-between items-center">
      <span class="text-sm text-gray-500 dark:text-gray-300 font-medium">{{ title }}</span>
      <span class="text-sm text-gray-700 dark:text-gray-300 font-mono bg-white dark:bg-gray-950 px-2 rounded border border-gray-200 dark:border-gray-800">{{ modelValue }}</span>
    </div>
    <input
      v-model.number="modelValue"
      type="range"
      :min="min"
      :max="max"
      :step="step"
      class="w-full h-2 bg-gray-200 dark:bg-gray-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-600"
    >
    <div class="flex justify-between text-xs text-gray-400 px-1">
      <span>{{ min }}</span>
      <span>{{ max }}</span>
    </div>
  </div>
</template>
