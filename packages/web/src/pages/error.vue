<template>
  <div class="size-full flex items-center justify-center">
    <div>
      <h1 class="font-bold text-2xl mt-4 mb-3">
        <FontAwesomeIcon
          :icon="faWarning"
          class="text-muted-foreground"
        />
        {{
          t(`error.${type || 'error'}.title`)
        }}
      </h1>
      <p class="font-light">
        {{ t(`error.${type || 'error'}.message`) }}
      </p>
      <pre
        v-if="message"
        class="mt-2 p-2 bg-muted rounded overflow-x-auto w-96"
      >{{ message }}</pre>
      <Button
        variant="outline"
        class="mt-5"
        @click="router.push('/')"
      >
        <FontAwesomeIcon :icon="faHome" />
        {{ t('common.backHome') }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from '@chat-tutor/ui'
import { faHome, faWarning } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()

defineProps<{
  type?: string;
  message?: string;
}>()
</script>