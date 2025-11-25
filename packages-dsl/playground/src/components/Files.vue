<script setup lang="ts">
import { useRouter } from 'vue-router';
import templates from '../templates';
import { ref } from 'vue';

const router = useRouter()

const currentType = ref<string>(router.currentRoute.value.params.type as string)
const currentId = ref<string | undefined>(router.currentRoute.value.params.id as string | undefined)
</script>

<template>
  <div class="container-common min-w-64 w-1/4 flex flex-col gap-1 text-sm overflow-y-auto">
    <div
      v-for="template in templates"
      :key="template.id"
      class="flex flex-col gap-1"
    >
      <div
        class="container-common container-interactive w-full h-10 flex items-center cursor-pointer flex-row gap-2"
        :class="{ 'bg-gray-200 dark:bg-gray-800': currentId === undefined && template.id === currentType }"
        @click="() => {
          router.push(`/${template.id}`)
          currentType = template.id
          currentId = undefined
        }"
      >
        <div class="w-4 h-4">
          {{ template.templates ? '📁' : '📄' }}
        </div>
        <div class="w-full dark:text-gray-200">
          {{ template.id }}
        </div>
      </div>
      <div
        v-if="template.templates"
        class="flex flex-col gap-1 border-l-2 border-gray-200 dark:border-gray-700 pl-2"
      >
        <div
          v-for="child in template.templates"
          :key="child.id"
          class="container-common container-interactive ml-3 h-8 flex items-center cursor-pointer flex-row gap-2"
          :class="{ 'bg-gray-200 dark:bg-gray-800': currentId === child.id }"
          @click="() => {
            router.push(`/${template.id}/${child.id}`)
            currentType = template.id
            currentId = child.id
          }"
        >
          <div class="w-4 h-4">
            {{ '📄' }}
          </div>
          <div class="w-full dark:text-gray-200">
            {{ child.id }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
