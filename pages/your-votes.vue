<template>
  <div>
    <div v-if="isServer">
      to renderuj na serwerze
    </div>

    <ClientOnly v-else>


      <div class="mb-2">
        TODO:
        <ul>
          <li>
            Dodać filtrowanie po nazwie głosowania lub nazwie propozycji (najlepiej po stronie naszego backu)
          </li>
          <li>
            Dodać filtrowanie po dacie (czyli minimalny i maksymalny timestamp do szukania) (najlepiej po stronie naszego backu)
          </li>
          <li>
            Dodać pagine
          </li>
        </ul>
      </div>


      <UPopover>
        <UButton color="neutral" variant="subtle" icon="i-lucide-calendar">
          <template v-if="dateRange.start">
            <template v-if="dateRange.end">
              {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }} - {{ df.format(dateRange.end.toDate(getLocalTimeZone())) }}
            </template>

            <template v-else>
              {{ df.format(dateRange.start.toDate(getLocalTimeZone())) }}
            </template>
          </template>
          <template v-else>
            Pick a date
          </template>
        </UButton>

        <template #content>
          <UCalendar v-model="dateRange" class="p-2" :number-of-months="2" range />
        </template>
      </UPopover>
  
      <div class="flex justify-center">
        <UInput 
          v-model="filter"
          type="text"
          placeholder="Filtruj po nazwie..."
          class="mb-4 p-2 w-full max-w-md mx-auto"
        />
      </div>

      <div v-if="votingStore.historyTotal" class="flex justify-center mb-5 md:mb-2">
        <UPagination v-model:page="page" :total="votingStore.historyTotal" :items-per-page="10" />
      </div>
      
      <div class="grid sm:grid-cols-2 lg:grid-cols-3">
        <UCard
          v-for="item in votingStore.history"
          :key="item.id"
          class="h-full mx-2 dark:hover:bg-slate-950 hover:bg-green-50 transition-colors"
        >
          <template #header>
            <h3 class="font-semibold text-lg">{{ item.title }}</h3>
          </template>

          <div class="text-sm">
            tutaj będzie skrócony opis
          </div>

          <div class="space-y-2">

            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
              <span class="font-medium">
                Zakończone: {{ formatDate(item.endTime) }}
              </span>
            </div>

            <div>
              Twój głos:
            </div>

            <div>
              {{ item.choice }}
            </div>

            <div class="space-y-1">
              <UButton 
                block
                label="Sprawdź integralność głosu"
                color="secondary"
                @click="navigateTo(`/votings/${item.id}`)"
              />
  
              <UButton 
                block
                label="Przejdź do głosowania"
                @click="navigateTo(`/votings/${item.id}`)"
              />
            </div>
          </div>
        </UCard>
      </div>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
import { whenever } from '@vueuse/core';
import { DateTime } from 'luxon';
import { CalendarDate, DateFormatter, getLocalTimeZone } from '@internationalized/date';

const votingStore = useVotingStore();
const ethereumStore = useEthereumStore();

const canFetchHistory = computed(() => ethereumStore.connection === 'established');

const page = ref(1);
const filter = ref('');

whenever(canFetchHistory, async () => {
  await votingStore.fetchHistory(ethereumStore.address);

  console.log(votingStore.history);
});

onMounted(async () => {
  if(canFetchHistory.value) {
    await votingStore.fetchHistory(ethereumStore.address);
  }
});

const isServer = computed(() => import.meta.server);

const formatDate = (timestamp: number) => {
  return DateTime.fromSeconds(timestamp).toFormat('dd.MM.yyyy HH:mm');
};

const df = new DateFormatter('en-US', {
  dateStyle: 'medium'
});

const dateRange = shallowRef({
  start: new CalendarDate(2022, 1, 20),
  end: new CalendarDate(2022, 2, 10)
});


</script>