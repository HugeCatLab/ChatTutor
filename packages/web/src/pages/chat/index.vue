<script setup lang="ts">
import DefaultLayout from '#/layout/default.vue'
import { Sidebar } from '#/components/sidebar'
</script>

<template>
  <DefaultLayout>
    <Sidebar>
      <template #main>
        Chat
      </template>
    </Sidebar>
  </DefaultLayout>
</template>