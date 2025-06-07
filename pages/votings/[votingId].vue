<template>
  <div class="flex justify-center py-8">
    <UCard class="w-full max-w-lg shadow-lg">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-semibold">{{ infuraData?.title }}</h2>
          <UBadge color="gray" variant="soft">{{ infuraData?.votingType }}</UBadge>
        </div>
      </template>
      <div class="space-y-2">
        <div class="flex items-center gap-2 text-sm text-gray-500">
          <UIcon name="i-heroicons-clock" class="text-primary" />
          <span>
            {{ formatDate(infuraData?.startTime) }}
            &ndash;
            {{ formatDate(infuraData?.endTime) }}
          </span>
        </div>
        <UFormField label="Wybierz propozycję" name="proposition" required>
          <USelect 
            v-if="infuraData?.propositions"
            v-model="selectedProposition"
            :items="propositionOptions"
            :loading="pending"
            placeholder="Wybierz z listy"
            :ui="{ base: 'w-full' }"
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
          
        <UCollapsible v-model:open="showNoWalletConnectionAlert">
          <template #content>
            <UAlert icon="i-lucide-circle-alert" class="bg-transparent text-red border mt-2" >
              <template #title>
                Wymagana akcja
              </template>
              <template #description>
                <div v-if="ethereumStore.connection === 'no_provider' || ethereumStore.connection === 'not_established'">
                  Niestety nie wykryto u Ciebie zainstalowanego <b>MetaMaska</b>. Najpierw musisz go dodać do rozszerzeń w przeglądarce i stworzyć konto. Jest to koniecznie w celu indentyfikacji.
                </div>

                <div v-else-if="ethereumStore.connection === 'needs_provider_login'">
                  Aby móc zagłosować musisz połączyć się ze swoim portfelem (MetaMask). Jest to koniecznie w celu indentyfikacji.
                </div>                

                <UButton
                  class="mt-2"
                  variant="soft"
                  label="Połącz się z portfelem"
                  :disabled="ethereumStore.connection === 'no_provider' || ethereumStore.connection === 'not_established'"
                  @click="ethereumStore.connect"
                />
              </template>
            </UAlert>
          </template>
        </UCollapsible>

        <UCollapsible v-model:open="showVoteError">
          <template #content>
            <UAlert icon="i-lucide-circle-alert" class="bg-transparent text-red border mt-2" >
              <template #title>
                Wystąpił problem
              </template>
              <template #description>
                <div>
                  {{ voteError }}
                </div>

                <UButton label="Napisz prośbę o przyznanie uprawnień" variant="soft" class="mt-2" @click="() => console.log('todo')"/>
              </template>
            </UAlert>
          </template>
        </UCollapsible>
      </div>
      <template #footer>
        <div class="flex justify-end gap-2">
          <UButton
            v-if="ethereumStore.connection === 'needs_provider_login'"
            label="Połącz się z portfelem"
          />

          <!-- dodać modal z guzikiem do połączenia portfela i potweirdzenia swojego głosu -->
          <UButton
            v-else-if="infuraData"
            :disabled="isDisabled"
            :loading="loading"
            label="Zagłosuj na wybraną propozycję"
            color="primary"
            @click="vote"
          />
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
import type { Voting } from '~/types/types';

const route = useRoute();
const toast = useToast();
const votingStore = useVotingStore();
const ethereumStore = useEthereumStore();

const selectedProposition = ref<null | string>(null);

const showNoWalletConnectionAlert = ref(false);

const voteError = ref<string | null>(null);

const showVoteError = computed({
  get: () => !!voteError.value,
  set: () => {
    voteError.value = '';
  }
});

const { 
  data: infuraData, 
  pending, 
  error: infuraError, 
  refresh 
} = useFetch<Voting>(`/api/voting/${route.params.votingId}`);

const propositionOptions = computed(() =>
  infuraData.value?.propositions.map((hash, idx) => ({
    label: `Propozycja #${idx + 1} (${hash.slice(0, 8)}...)`,
    value: hash
  })) ?? []
);

const selectedPropositionId = computed(() => {
  const foundIndex = infuraData.value?.propositions.findIndex(el => el === selectedProposition.value);
  if(foundIndex === -1) {
    return null;
  }
  return foundIndex;
});

const isDisabled = computed(() => selectedPropositionId.value === null || selectedPropositionId.value === undefined || showNoWalletConnectionAlert.value);

const loading = ref(false);

const vote = async () => {
  if(ethereumStore.connection !== 'established') {
    showNoWalletConnectionAlert.value = true;
  }

  if(!infuraData.value || isDisabled.value) return;

  voteError.value = null;

  loading.value = true;
  try{
    await votingStore.vote(infuraData.value.id, selectedPropositionId.value);
  } catch (e) {
    console.error(e);
    voteError.value = e.message;

    toast.add({
      title: 'Wystąpił problem',
      description: e.message
    });
  } finally {
    loading.value = false;
  }
};

// Funkcja do formatowania daty z Luxon
function formatDate(dateString?: string) {
  if (!dateString) return '';
  return DateTime.fromISO(dateString).setLocale('pl').toFormat('dd.MM.yyyy HH:mm');
}
</script>
