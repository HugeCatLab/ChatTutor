<script setup lang="ts">
import type { BaseForm, SliderForm } from '@chat-tutor/shared'
import { FormType } from '@chat-tutor/shared'
import type { createRenderer } from '@dsl/renderer-runtime'

const props = defineProps<{
  forms: BaseForm<FormType>[]
  page: string
}>()

const models = shallowRef<Record<string, Ref<number>>>({})
let watchers: (() => void)[] = []

watch(() => props.forms, (forms) => {
  watchers.forEach(unwatch => unwatch())
  watchers = []
  
  const newModels: Record<string, Ref<number>> = {}

  for (const form of forms) {
    if (form.type === FormType.SLIDER) {
      const r = ref((form as SliderForm).value)
      const unwatch = watch(r, (value) => {
        const renderer = rendererMap.get(props.page) as ReturnType<typeof createRenderer>
        if (renderer) {
          renderer.setValue(form.bind, value)
        }
      })
      watchers.push(unwatch)
      newModels[form.bind] = r
    }
  }
  models.value = newModels
}, { immediate: true, deep: true })

onBeforeUnmount(() => {
  watchers.forEach(unwatch => unwatch())
})
</script>

<template>
  <div class="size-full flex flex-col gap-2 border border-gray-300 dark:border-gray-700 rounded-lg p-3 overflow-y-auto">
    <div
      v-for="form in forms"
      :key="form.title"
      class="w-full flex flex-col"
    >
      <ISlider
        v-if="form.type === FormType.SLIDER"
        v-bind="form as SliderForm"
        v-model:value="models[form.bind]!.value"
      />
    </div>
  </div>
</template>
