<template>
  <div v-if="role">
    Twoja rola: <strong>{{ role }}</strong>
  </div>
</template>

<script setup lang="ts">

const { role } = useVoting();

</script>
