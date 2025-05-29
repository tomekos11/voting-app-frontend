<template>
  <div>
    xD
  </div>
</template>

<!-- <template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h2 class="text-xl font-semibold">Aktualne głosowania</h2>
        <UBadge color="green" variant="solid">
          Live Blockchain Data
        </UBadge>
      </div>
    </template>
  
    <div v-if="pending" class="text-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin h-8 w-8 text-primary-500" />
    </div>
  
    <div v-else class="space-y-4">
      <div v-for="voting in data.activeVotings" :key="voting.id" class="border rounded-lg p-4 hover:bg-gray-50">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-medium">Głosowanie #{{ voting.id }}</h3>
            <p class="text-sm text-gray-500">{{ voting.candidates }} kandydatów</p>
          </div>
          <UBadge :color="votingStatusColor(voting.status)" variant="subtle">
            {{ voting.status }}
          </UBadge>
        </div>
          
        <UProgress 
          :value="calculateProgress(voting)"
          class="mt-2"
          :ui="{ rounded: 'rounded-full' }"
        />
          
        <UButton 
          class="mt-3"
          icon="i-heroicons-check-circle"
          @click="openVotingModal(voting.id)"
        >
          Zagłosuj
        </UButton>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">

</script> -->