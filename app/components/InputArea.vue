<script setup lang="ts">
import type { InputTypeHTMLAttribute } from 'vue'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faSave } from '@fortawesome/free-solid-svg-icons'

defineProps<{
  type: InputTypeHTMLAttribute
  label: string
  description?: string
  placeholder?: string
}>()

const model = defineModel<string>({ required: false, default: '' })

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
  <SettingsItemSkeleton>
    <template #leading>
      {{ label }}
    </template>
    <template #tailing>
      <input
        v-model="model"
        :type="type"
        :placeholder="placeholder"
        class="size-full p-2 bg-transparent outline-none resize-none text-gray-500 focus:outline-none rounded-lg shadow-sm border border-gray-300 dark:border-gray-500 placeholder:italic placeholder:opacity-50"
      >
      <div
        class="h-9 button-container"
        :class="saved ? 'w-0' : 'w-9'"
      >
        <Transition name="expand">
          <ButtonContainer
            v-if="!saved"
            class="w-full h-full justify-center items-center flex hover:text-red-400"
            @click="save"
          >
            <FontAwesomeIcon :icon="faSave" />
          </ButtonContainer>
        </Transition>
      </div>
    </template>
    <template
      v-if="description"
      #description
    >
      {{ description }}
    </template>
  </SettingsItemSkeleton>
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
