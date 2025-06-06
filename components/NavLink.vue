<template>
  <UButton
    :to="to"
    class="nav-btn"
    :color="$route.fullPath === to ? 'success' :'neutral'"
    variant="link"
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