<script setup lang="ts">
import { client } from '#/utils/client'
import { SidebarGroup, SidebarGroupLabel, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, Spinner } from '@chat-tutor/ui'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'

const { t } = useI18n()

interface Item {
  title: string
  url: string
  date: string
}

const items = ref<Item[]>([])
const fetching = ref(false)

const fetchItems = async () => {
  if (fetching.value) {
    return
  }
  fetching.value = true
  const { data, error } = await client.chat.get({
    query: {
      limit: 15,
      offset: 0,
    }
  })
  if (error || !data) {
    return
  }
  items.value = data.map((item) => ({
    title: item.title,
    url: `/chat/${item.id}`,
    date: item.createdAt?.toLocaleDateString() ?? '',
  }))
  fetching.value = false
}

const loading = computed(() => {
  return fetching.value && items.value.length === 0
})

// const interval = ref<number | null>(null)

onMounted(() => {
  fetchItems()
  // interval.value = window.setInterval(fetchItems, 5000)
})

onUnmounted(() => {
  // if (interval.value !== null) clearInterval(interval.value)
})
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel>
      {{ t('common.recent') }}
      <Spinner
        v-if="loading"
        class="ml-2"
      />
    </SidebarGroupLabel>
    <SidebarGroupContent class="overflow-y-auto">
      <SidebarMenu>
        <SidebarMenuItem
          v-for="item in items"
          :key="item.title"
        >
          <SidebarMenuButton as-child>
            <RouterLink :to="item.url">
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>