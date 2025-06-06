<template>
  <div>
    <div>
      xD
    </div>
    <div>
      {{ incomingVotings }}

      <UButton label="pobierz" @click="fetchIncomingVotings(0, 3)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Voting } from '~/types/types';


interface Response {
  data: Voting[];
  total: number;
}

const { fetchIncomingVotings, incomingVotings } = useVoting();

</script>