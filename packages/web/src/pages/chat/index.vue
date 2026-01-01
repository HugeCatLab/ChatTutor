<script setup lang="ts">
import { ChatUI, ChatBoard, ChatPagination } from '#/components/chat'
</script>

<template>
  <div class="size-full flex flex-row">
    <div class="w-5/7 flex flex-col h-full py-2 gap-2">
      <div class="flex flex-row h-5/7">
        <ChatBoard />
      </div>
      <div class="flex flex-row h-2/7">
        <ChatPagination />
      </div>
    </div>
    <div class="w-2/7">
      <ChatUI />
    </div>
  </div>
</template>