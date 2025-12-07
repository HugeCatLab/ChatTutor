<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faChevronDown } from '@fortawesome/free-solid-svg-icons'
const modelValue = defineModel<string>()
const props = defineProps<{options: [string, string][], label: string}>()
const emits = defineEmits<{(e: 'save', value: typeof props.options[number][1]): void}>()

watch(modelValue, (value) => {
  if (value) {
    emits('save', value)
  }
})
</script>

<template>
  <SettingsItemSkeleton>
    <template #leading>
      {{ label }}
    </template>
    <template #tailing>
      <span class="flex-1" />
      <div class="relative">
        <div class="flex flex-row justify-between items-center pl-2 pr-2 rounded-lg shadow-sm border border-gray-300 dark:border-gray-500 text-gray-400 absolute top-0 left-0 size-full">
          <span>{{ options.find(([_, value]) => value == modelValue)![0] }}</span>
          <FontAwesomeIcon
            :icon="faChevronDown"
            class="w-3 h-3"
          />
        </div>
        <select
          v-model="modelValue"
          class="opacity-0 h-9"
          :name="label"
        >
          <option
            v-for="option in options"
            :key="option[1]"
            :value="option[1]"
          >
            {{ option[0] }}
          </option>
        </select>
      </div>
    </template>
  </SettingsItemSkeleton>
</template>

<style scoped>
</style>
