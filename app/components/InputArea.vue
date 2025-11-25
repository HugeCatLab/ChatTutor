<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  type: InputTypeHTMLAttribute
  label: string
  description?: string
}>()

const model = defineModel<string>('model', { required: false, default: '' })

const saved = ref(true)
let lastSaved = model.value

onMounted(() => {
  nextTick(() => {
    saved.value = true
    lastSaved = model.value
  })
})

watch(model, (value) => {
  if (lastSaved === value) {
    saved.value = true
    return
  }
  saved.value = false
})

const emits = defineEmits<{
  (e: 'save', value: string): void
}>()

const save = () => {
  const input = model.value
  emits('save', input)
  lastSaved = input
  saved.value = true
}
</script>

<template>
  <div class="flex flex-col w-full">
    <div class="flex w-full flex-row gap-2 h-9 justify-start items-center">
      <span class="text-md text-gray-500 w-30">{{ label }}</span>
      <input v-model="model"
        class="size-full p-2 bg-transparent outline-none resize-none text-gray-500 focus:outline-none rounded-lg shadow-sm border border-gray-300 dark:border-gray-500">
      <div class="relative h-9 overflow-hidden button-container" :class="saved ? 'w-0' : 'w-9'">
        <Transition name="expand">
          <ButtonContainer v-if="!saved"
            class="absolute left-0 top-0 w-9 h-9 justify-center items-center flex hover:text-red-400" @click="save">
            <FontAwesomeIcon :icon="faSave" />
          </ButtonContainer>
        </Transition>
      </div>
    </div>
    <div v-if="description" class="text-sm text-gray-500">
      {{ description }}
    </div>
  </div>
</template>

<style scoped>
.button-container {
  transition: width 0.3s ease;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from {
  opacity: 0;
  transform: translateX(10px) scale(0.8);
}

.expand-leave-to {
  opacity: 0;
  transform: translateX(10px) scale(0.8);
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}
</style>
