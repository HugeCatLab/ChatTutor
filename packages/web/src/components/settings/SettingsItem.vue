<script setup lang="ts">
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Input,
  Label,
} from '@chat-tutor/ui'

interface Option {
  label: string
  value: string
}

interface Props {
  label: string
  description?: string
  type?: 'input' | 'password' | 'select'
  placeholder?: string
  options?: Option[]
}

const props = withDefaults(defineProps<Props>(), {
  type: 'input',
})

const modelValue = defineModel<string>()
</script>

<template>
  <div class="grid w-full items-center gap-1.5">
    <Label
      :for="label"
      class="text-sm font-medium"
    >{{ label }}</Label>

    <template v-if="type === 'input' || type === 'password'">
      <Input
        :id="label"
        v-model="modelValue"
        :type="type"
        :placeholder="placeholder"
      />
    </template>

    <template v-else-if="type === 'select'">
      <Select v-model="modelValue">
        <SelectTrigger :id="label">
          <SelectValue>
            {{ options?.find(opt => opt.value === modelValue)?.label || placeholder }}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem
            v-for="opt in options"
            :value="opt.value"
          >
            {{ opt.label }}
          </SelectItem>
        </SelectContent>
      </Select>
    </template>

    <p
      v-if="description"
      class="text-sm text-muted-foreground"
    >
      {{ description }}
    </p>
  </div>
</template>