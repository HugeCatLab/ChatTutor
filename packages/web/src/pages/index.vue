<script setup lang="ts">
import { Sidebar } from '#/components/sidebar'
import DefaultLayout from '#/layout/default.vue'
import Home from './home.vue'
</script>

<template>
  <DefaultLayout>
    <Sidebar>
      <template #main>
        <Home />
      </template>
    </Sidebar>
  </DefaultLayout>
</template>