<script setup lang="ts">
import { client } from '#/utils/client'
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@chat-tutor/ui'
import { onUnmounted, ref } from 'vue'

interface Item {
  title: string
  url: string
  date: string
}

const items = ref<Item[]>([])

const fetchItems = async () => {
  const { data, error } = await client.chat.get({
    query: {
      limit: 15,
      offset: 0,
    }
  })
  if (error || !data) {
    return
  }
  console.log(data)
  items.value = data.map((item) => ({
    title: item.title,
    url: `/chat/${item.id}`,
    date: item.createdAt?.toLocaleDateString() ?? '',
  }))
}

const interval = setInterval(fetchItems, 1000)

onUnmounted(() => {
  clearInterval(interval)
})
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>Recent</SidebarGroupLabel>
    <SidebarGroupContent class="overflow-y-auto">
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