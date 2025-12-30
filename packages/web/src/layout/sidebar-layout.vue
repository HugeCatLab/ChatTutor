<script setup lang="ts">
import { Sidebar } from '#/components/sidebar'
</script>

<template>
  <div class="w-full flex">
    <Sidebar>
      <template #main>
        <RouterView />
      </template>
    </Sidebar>
  </div>
</template>

