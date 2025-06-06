<template>
  <div v-if="votingStore.role">
    Twoja rola: <strong>{{ votingStore.role }}</strong>
  </div>
</template>

<script setup lang="ts">

const votingStore = useVotingStore();

</script>
