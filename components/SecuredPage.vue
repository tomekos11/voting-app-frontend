<template>
  <div 
    v-if="!votingStore.initialized && ethereumStore.connection !== 'no_provider'" 
    class="flex items-center justify-center min-h-[80svh] space-y-4"
  >
    <div class="text-center">
      <UIcon 
        name="i-heroicons-arrow-path-20-solid" 
        class="w-12 h-12 text-primary-500 animate-spin mb-4"
      />
      <p class="text-gray-900 dark:text-white font-medium">
        Trwa inicjalizacja portfela blockchain...
      </p>
    </div>
  </div>

  <template v-else>
    <div v-if="votingStore.hasAdminPermissions">
      <slot />
    </div>

    <template v-else>
      <div>
        Ta strona wymaga uprawnień administratora.
      </div>
  
      <div>
        <UButton
          v-if="!ethereumStore.address"
          label="Połącz z MetaMask"
          @click="ethereumStore.connect"
        />
      </div>
    </template>
  </template>
  
</template>

<script setup lang="ts">

const ethereumStore = useEthereumStore();
const votingStore = useVotingStore();

const error = ref(false);

</script>