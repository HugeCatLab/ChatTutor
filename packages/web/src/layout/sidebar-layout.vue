<script setup lang="ts">
import { Sidebar } from '#/components/sidebar'
import { SidebarProvider } from '@chat-tutor/ui'
</script>

<template>
  <SidebarProvider class="items-stretch size-full">
    <div class="w-full flex overflow-hidden">
      <Sidebar>
        <template #main>
          <RouterView />
        </template>
      </Sidebar>
    </div>
  </SidebarProvider>
</template>

