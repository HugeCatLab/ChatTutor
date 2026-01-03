<script setup lang="ts">
import type { ClientMessage, UserClientMessage, AgentClientMessage } from '@chat-tutor/shared'
import UserMessage from './user-message.vue'
import AgentMessage from './agent-message.vue'
import TaskMessage from './task-message.vue'

const messages = defineModel<ClientMessage[]>('messages', { default: () => [] })
</script>

<template>
  <div class="flex flex-col h-full gap-2">
    <div
      v-for="message in messages"
      :key="message.id"
    >
      <ClientOnly>
        <UserMessage
          v-if="message.type === 'user'"
          :message="message as UserClientMessage"
        />
        <AgentMessage
          v-else-if="message.type === 'agent'"
          :message="message as AgentClientMessage"
        />
        <TaskMessage
          v-else
          :message="message"
        />
      </ClientOnly>
    </div>
  </div>
</template>
