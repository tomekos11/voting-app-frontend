<template>
  <div>
    <div>
      xD
    </div>

    <div>
      {{ infuraData?.propositions }}
    </div>

    <UFormField label="Wybierz propozycję" name="proposition" required>
      {{ selectedProposition }}
      <USelect 
        v-if="infuraData?.propositions"
        v-model="selectedProposition"
        :items="infuraData.propositions"
        :loading="pending"
        placeholder="Wybierz z listy"
        :ui="{
          base: 'w-64'
        }"
      >
        <template #error>
          <UAlert 
            v-if="error"
            title="Błąd ładowania opcji"
            :description="error.message"
            icon="i-heroicons-exclamation-triangle"
            color="red"
            variant="subtle"
            class="mt-2"
          />
        </template>
      </USelect>
    </UFormField>

    <template v-if="votingStore.contract">
      <!-- TODO -->
      <!-- <UButton v-if="selectedProposition" label="Zagłosuj na wybraną propozycje" @click="votingStore.vote()"/> -->

    </template>
    <UButton v-else label="Połącz się z portfelem" />

  </div>
  
</template>

<script setup lang="ts">
import type { Voting } from '~/types/types';


// funkcja na pobranie danych z off-chain

const route = useRoute();

const votingStore = useVotingStore();
const ethereumStore = useEthereumStore();

const selectedProposition = ref<null | string>(null);

// const selectedPropositionId = computed(() => {
//   const foundIndex = infuraData.value?.propositions.findIndex(el => el === selectedProposition.value);
//   if(foundIndex === -1) {
//     return null;
//   }

//   return foundIndex;
// });

// jest użyta infura i tyle, żeby dane byly po SSR w końcu to zwykły get
const { 
  data: infuraData, 
  pending, 
  error, 
  refresh 
} = useFetch<Voting>(`/api/voting/${route.params.votingId}`);

</script>