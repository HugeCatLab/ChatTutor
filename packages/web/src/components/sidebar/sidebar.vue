<script setup lang="ts">
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar, Button } from '@chat-tutor/ui'
import SidebarChatHistory from './sidebar-chat-history.vue'
import { watch } from 'vue'
import { useRouter } from 'vue-router'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faCog, faBars, faPlus } from '@fortawesome/free-solid-svg-icons'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

const { t } = useI18n()
const router = useRouter()
const { open, setOpen, openMobile, setOpenMobile, isMobile, toggleSidebar } = useSidebar()

const sidebarOpen = computed(() => {
  return isMobile.value ? openMobile.value : open.value
})

const setSidebarOpen = (value: boolean) => {
  if (isMobile.value) {
    setOpenMobile(value)
  } else {
    setOpen(value)
  }
}

watch(router.currentRoute, (route) => {
  setSidebarOpen(route.path === '/')
}, { immediate: true })
</script>

<template>
  <Sidebar
    collapsible="icon"
    variant="inset"
  >
    <SidebarContent class="text-gray-500 select-none dark:text-gray-400">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                as-child
                class="size-8"
                @click="toggleSidebar"
              >
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
              <SidebarMenuButton
                as-child
                :tooltip="t('common.newChat')"
                @click="router.push('/')"
              >
                <div class="size-4">
                  <FontAwesomeIcon :icon="faPlus" />
                  <span>
                    {{ t('common.newChat') }}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton
                as-child
                :tooltip="t('settings.title')"
                @click="router.push('/settings')"
              >
                <div>
                  <FontAwesomeIcon :icon="faCog" />
                  <span>
                    {{ t('settings.title') }}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarChatHistory v-if="sidebarOpen" />
    </SidebarContent>
  </Sidebar>
  <main class="size-full overflow-hidden">
    <slot name="main" />
  </main>
  <div
    v-if="isMobile"
    class="fixed top-5 left-4"
  >
    <Button
      variant="ghost"
      class="bg-background shadow"
      @click="toggleSidebar"
    >
      <FontAwesomeIcon :icon="faBars" />
    </Button>
  </div>
</template>