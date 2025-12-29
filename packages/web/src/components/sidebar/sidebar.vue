<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent } from '@chat-tutor/ui'
import SidebarChatHistory from './sidebar-chat-history.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(route.path === '/')
</script>

<template>
  <SidebarProvider v-model:open="open">
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarTrigger />
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarChatHistory v-show="open" />
      </SidebarContent>
    </Sidebar>
    <main class="w-full">
      <slot name="main" />
    </main>
  </SidebarProvider>
</template>