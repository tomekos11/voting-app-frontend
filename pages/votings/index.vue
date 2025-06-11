<template>
  <div class="space-y-8">
    <active-votings-loading v-if="activeVotingsPending" />

    <section v-if="noData">
      Brak stworzonych głosowań.
    </section>

    <section v-if="activeVotings && activeVotings.data.length" class="px-16">
      <h2 class="text-2xl font-bold mb-4 mt-10 pl-5">Aktywne głosowania</h2>

      <UCarousel
        ref="carousel"
        v-slot="{ item }" 
        loop
        arrows
        :autoplay="{ delay: 3500, stopOnMouseEnter: true }"
        :items="activeVotings.data"
        :ui="{
          item: 'basis-full md:basis-1/2 lg:basis-1/3'
        }"
      >
        <UCard 
          class="h-full mx-2 dark:hover:bg-slate-950 hover:bg-green-50 transition-colors"
        >
          <template #header>
            <h3 class="font-semibold text-lg">{{ item.title }}</h3>
          </template>

          <div class="text-sm">
            tutaj będzie skrócony opis
          </div>

          <div class="text-sm">
            Ilość propozycji <UBadge>{{ item.propositions.length }}</UBadge>
          </div>

          <div class="space-y-4">
            <UProgress 
              :model-value="timeProgress(item)"
              :min="0"
              :max="100"
              status
              :ui="{ size: 'md', rounded: 'rounded-full' }"
              class="mt-2"
            />

            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
              <span class="font-medium">
                Zaczęte: {{ formatDate(item.startTime) }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
              <span class="font-medium">
                Kończy się: {{ formatDate(item.endTime) }}
              </span>
            </div>

            <div class="flex items-center gap-2 text-sm">
              <UIcon name="i-heroicons-clock" class="w-5 h-5 text-primary-600" />
              <span class="font-medium">
                Do zakończenia: {{ timeToEnd(item.endTime) }}
              </span>
            </div>

            <UButton 
              block
              label="Przejdź do głosowania"
              @click="navigateTo(`/votings/${item.id}`)"
            />
          </div>
        </UCard>
      </UCarousel>


      <!-- kulki nawigacyjne -->
      <div class="flex gap-2 justify-center pt-4 max-w-xs mx-auto" >
        <div
          v-for="(item, index) in activeVotings.data"
          :key="index"
          class="size-2 rounded-full cursor-pointer transition-colors"
          :class="activeIndex === index ? 'bg-green-600 opacity-100' : 'bg-gray-400 opacity-50 hover:opacity-80'"
          @click="select(index)"
          @mouseenter="stopCarousel"
          @mouseleave="startCarousel"
        />
      </div>
    </section>

    <section v-if="incomingVotings && incomingVotings.data.length">
      <h2 class="text-2xl font-bold mb-4">Nadchodzące głosowania</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <UCard 
          v-for="voting in incomingVotings.data"
          :key="voting.id"
          class="opacity-75 hover:opacity-100 transition-opacity bg-gray-50"
        >
          <template #header>
            <h3 class="font-semibold text-gray-700">{{ voting.title }}</h3>
          </template>

          <div class="space-y-2">
            <div class="flex items-center gap-2 text-sm text-gray-600">
              <UIcon name="i-heroicons-calendar" class="w-5 h-5" />
              <span>Rozpoczyna się: {{ formatDate(voting.startTime) }}</span>
            </div>

            <UAlert 
              v-if="timeToStart(voting.startTime)"
              icon="i-heroicons-clock"
              color="primary"
              variant="subtle"
            >
              <template #title>
                Start za: {{ timeToStart(voting.startTime) }}
              </template>
            </UAlert>
          </div>
        </UCard>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { DateTime } from 'luxon';
// import { useInterval } from '@vueuse/core';
import type { Voting } from '~/types/types';

// const votingStore = useVotingStore();
const ethereumStore = useEthereumStore();
const now = ref(DateTime.now());

// Automatyczna aktualizacja czasu co sekundę
// useInterval(1000, () => {
//   now.value = DateTime.now();
// });

// const activeVotings = computed(() => votingStore.votings.active);
// const incomingVotings = computed(() => votingStore.votings.incoming);
// const completedVotings = computed(() => votingStore.votings.completed);

// const noData = computed(() => !activeVotings.value.length && !incomingVotings.value.length && !completedVotings.value.length);
const noData = computed(() => !activeVotings.value && !incomingVotings.value);
const formatDate = (timestamp: number) => {
  return DateTime.fromSeconds(timestamp).toFormat('dd.MM.yyyy HH:mm');
};

const timeProgress = (voting: Voting) => {
  const start = DateTime.fromSeconds(voting.startTime);
  const end = DateTime.fromSeconds(voting.endTime);
  const totalDuration = end.diff(start).as('milliseconds');
  const elapsed = now.value.diff(start).as('milliseconds');

  return Math.min((elapsed / totalDuration) * 100, 100);
};

const timeToEnd = (endTime: number) => {
  const end = DateTime.fromSeconds(endTime);
  const diff = end.diff(now.value, ['days', 'hours', 'minutes']).toObject();
  
  if (end <= now.value) return null;

  const days = Math.floor(diff.days || 0);
  const hours = Math.floor(diff.hours || 0);
  const minutes = Math.floor(diff.minutes || 0);

  const parts = [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours}h` : '',
    minutes > 0 ? `${minutes}m` : '0m'
  ].filter(Boolean);

  return `Pozostało: ${parts.join(' ') || '0m'}`;
};

const timeToStart = (startTime: number) => {
  const start = DateTime.fromSeconds(startTime);
  const diff = start.diff(now.value, ['days', 'hours', 'minutes']).toObject();
  
  if (start <= now.value) return null;

  const days = Math.floor(diff.days || 0);
  const hours = Math.floor(diff.hours || 0);
  const minutes = Math.floor(diff.minutes || 0);

  return [
    days > 0 ? `${days}d` : '',
    hours > 0 ? `${hours}h` : '',
    minutes > 0 ? `${minutes}m` : '0m'
  ].filter(Boolean).join(' ');
};


const {
  data: activeVotings,
  pending: activeVotingsPending,
  refresh: refreshActive
} = useFetch('/api/votings/active', {
  query: { page: 0, perPage: 10 },
});

const {
  data: incomingVotings,
  pending: incomingPending,
  refresh: refreshIncoming
} = useFetch('/api/votings/incoming', {
  query: { page: 0, perPage: 10 },
});

const carousel = useTemplateRef('carousel');
const activeIndex = ref(0);

const select = (index: number) => {
  activeIndex.value = index;

  carousel.value?.emblaApi?.scrollTo(index);
};


const stopCarousel = () => {
  carousel.value?.emblaApi?.plugins()?.autoplay?.stop();
};

const startCarousel = () => {
  carousel.value?.emblaApi?.plugins()?.autoplay?.play();
};
</script>