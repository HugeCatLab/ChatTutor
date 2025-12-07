<template>
  <div class="flex flex-col w-full">
    <div class="flex w-full flex-row gap-2 h-9 justify-start items-center">
      <div class="text-md text-gray-500 w-30">
        <slot name="leading" />
      </div>
      <slot name="tailing" />
    </div>
    <div
      v-if="$slots.description"
      class="text-sm text-gray-500"
    >
      <slot name="description" />
    </div>
  </div>
</template>
