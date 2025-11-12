<script setup lang="ts">
import type { RendererError } from '@dsl/renderer-runtime';

const props = defineProps<{
  errors: RendererError<string>[]
}>()
</script>

<template>
  <div class="container-common min-w-64 w-1/4 flex flex-col gap-1 text-sm">
    <div
      v-for="err in errors"
      :key="err.name"
    >
      <div class="container-common container-interactive w-full h-10 flex items-center cursor-pointer flex-row gap-2">
        <div class="w-4 h-4">
          {{ '🚨' }}
        </div>
        <div class="w-full">
          {{ err.name }}
        </div>
        <div class="w-full">
          {{ err.message }}
        </div>
      </div>
    </div>
  </div>
</template>
