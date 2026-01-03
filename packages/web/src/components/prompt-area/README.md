# Prompt Area Component

A feature-rich prompt input component for ChatTutor that supports text input, image upload, drag & drop, and paste functionality.

## Features

- ✅ Text input with multi-line support
- ✅ Image upload via button click
- ✅ Image paste from clipboard (Cmd/Ctrl + V)
- ✅ Drag and drop image files
- ✅ Multiple image uploads
- ✅ Image preview with remove functionality
- ✅ Send button with loading animation
- ✅ Keyboard shortcut (Cmd/Ctrl + Enter to send)
- ✅ Dark mode support
- ✅ Responsive design

## Usage

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { PromptArea, type Resource } from '#/components/prompt-area'

const input = ref('')
const resources = ref<Resource[]>([])
const running = ref(false)

const handleSend = (message: string, attachments: Resource[]) => {
  console.log('Message:', message)
  console.log('Attachments:', attachments)
  
  // Handle sending message
  running.value = true
  // ... your logic
  running.value = false
}
</script>

<template>
  <div class="h-32 w-full">
    <PromptArea
      v-model:input="input"
      v-model:resources="resources"
      :running="running"
      @send="handleSend"
    />
  </div>
</template>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `running` | `boolean` | `false` | Shows loading state and disables inputs |

## V-Models

| Model | Type | Description |
|-------|------|-------------|
| `input` | `string` | The text input value |
| `resources` | `Resource[]` | Array of uploaded image resources |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `send` | `(input: string, resources: Resource[])` | Emitted when user sends a message |

## Types

```typescript
interface ImageResource {
  type: 'image'
  url: string
  id: string
}

type Resource = ImageResource
```

## API Requirement

The component expects a file upload endpoint at `/api/file/upload` that:
- Accepts `multipart/form-data` POST requests
- Returns JSON with `{ url: string, id: string, key: string }`
- Only processes image files

## Styling

The component uses Tailwind CSS and supports dark mode out of the box. It adapts to the parent container size, so wrap it in a container with a specific height:

```vue
<div class="h-32 w-full max-w-2xl">
  <PromptArea ... />
</div>
```

## Keyboard Shortcuts

- **Cmd/Ctrl + Enter**: Send message
- **Cmd/Ctrl + V**: Paste images from clipboard

## Browser Support

- Modern browsers with File API support
- Drag & Drop API support
- Clipboard API support for image paste

