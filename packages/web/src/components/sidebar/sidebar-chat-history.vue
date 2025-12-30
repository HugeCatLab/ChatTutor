<script setup lang="ts">
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@chat-tutor/ui'

const items = [
  {
    title: 'Chat History',
    url: '/chat',
  },
]
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Recent</SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem
          v-for="item in items"
          :key="item.title"
        >
          <SidebarMenuButton as-child>
            <a :href="item.url">
              <span>{{ item.title }}</span>
            </a>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>