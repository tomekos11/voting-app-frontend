<template>
  <div 
    v-if="!votingStore.initialized && !ethereumStore.connection" 
    class="flex items-center justify-center min-h-[80svh] space-y-4"
  >
    <div class="text-center">
      <UIcon 
        name="i-heroicons-arrow-path-20-solid" 
        class="w-12 h-12 text-secondary-500 animate-spin mb-4"
      />
      <p class="text-gray-900 dark:text-white font-medium">
        Trwa inicjalizacja portfela blockchain...
      </p>
    </div>
  </div>

  <ClientOnly v-else>
    <div v-if="votingStore.hasAdminPermissions">
      <slot />
    </div>

    <div v-else class="flex flex-col items-center justify-center min-h-[80svh] space-y-4">
      <div>
        Ta strona wymaga uprawnień administratora.
      </div>
  
      <div>
        <UButton
          v-if="!ethereumStore.address"
          label="Połącz z MetaMask"
          variant="soft"
          color="secondary"
          @click="ethereumStore.connect"
        />
      </div>
    </div>
  </ClientOnly>
  
</template>

<script setup lang="ts">

const ethereumStore = useEthereumStore();
const votingStore = useVotingStore();

const error = ref(false);

</script>