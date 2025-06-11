<template>
  <UButton
    :to="to"
    class="bg-transparent hover:bg-secondary/15 py-1 px-1.5 text-gray-300"
    :color="$route.fullPath === to ? 'success' :'neutral'"
    :label="label"
  />
</template>

<script setup lang="ts">

interface Props {
  to: string;
  label: string;
}

defineProps<Props>();
</script>