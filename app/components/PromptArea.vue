<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

const input = defineModel<string>('input', { required: true })
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const blur = () => {
  textareaRef.value?.blur()
}

defineEmits<{
  (e: 'send', input: string): void
}>()

defineExpose({
  blur
})
</script>

<template>
  <div class="size-full bg-gray-100 p-2 rounded-lg flex flex-row items-center justify-center md:flex-col border border-gray-300 shadow-lg">
    <textarea
      ref="textareaRef"
      v-model="input"
      class="size-full bg-transparent outline-none resize-none text-gray-500"
    />
    <div class="flex flex-row items-center justify-center md:justify-end w-full h-10">
      <div class="w-full flex flex-row mr-auto justify-end">
        <ButtonContainer class="size-8 justify-center items-center flex">
          <FontAwesomeIcon
            :icon="faPaperPlane"
            class="size-4"
            @click="$emit('send', input)"
          />
        </ButtonContainer>
      </div>
    </div>
  </div>
</template>