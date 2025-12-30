<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarProvider, SidebarTrigger, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@chat-tutor/ui'
import SidebarChatHistory from './sidebar-chat-history.vue'
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faBars, faPlus } from '@fortawesome/free-solid-svg-icons'

const route = useRoute()
const open = ref(route.path === '/')
</script>

<template>
  <SidebarProvider v-model:open="open">
    <Sidebar collapsible="icon" variant="floating">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child class="size-8" @click="open = !open">
                  <div class="size-4">
                    <FontAwesomeIcon :icon="faBars" />
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton as-child tooltip="New Chat">
                  <div class="size-4">
                    <FontAwesomeIcon :icon="faPlus" />
                    <span>New Chat</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton as-child tooltip="Settings">
                  <a href="/settings">
                    <FontAwesomeIcon :icon="faCog" />
                    <span>Settings</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
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