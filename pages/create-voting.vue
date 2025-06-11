<template>

  <section>

    <div class="flex items-center justify-center gap-3 mb-10">
      <UIcon name="i-lucide-vote" class="w-7 h-7 text-primary" />
      <h2 class="text-2xl font-bold dark:text-gray-100 text-primary text-center">Stwórz głosowanie</h2>
    </div>
      
    <UStepper
      ref="stepper"
      v-model:model-value="step" :items="items" :ui="{
        container: 'mb-5'
      }">
      <template #name>

        <UCard
          class="m-4 dark:bg-transparent mx-auto max-w-xl"
          :ui="{
            footer: 'flex justify-center'
          }"
        >
          <template #header>
            <div class="flex items-center gap-3 mb-6">
              <h2 class="text-2xl font-bold dark:text-gray-100 text-primary">Wybierz tytuł i typ głosowania</h2>
            </div>
          </template>

          <create-voting-title-and-type v-model:title="title" v-model:voting-type="votingType" />

          <UAlert v-if="titleError || votingTypeError" class="bg-error text-white my-3">
            <template #title>
              Wystąpił Błąd Walidacji
            </template>
            <template #description>
              {{ titleError || votingTypeError }}
            </template>
          </UAlert>

          <div class="flex justify-center mt-4">
            <UButton label="Przejdź do następnego kroku" icon="i-lucide-circle-arrow-right" @click="stepper?.next" />
          </div>

        </UCard>
      </template>
  
      <template #span>
        <UCard
          class="m-4 dark:bg-transparent mx-auto max-w-xl"
          :ui="{
            footer: 'flex justify-center'
          }"
        >
          <template #header>
            <div class="flex items-center gap-3 mb-6">
              <h2 class="text-2xl font-bold dark:text-gray-100 text-primary">Wybierz datę początku i końca głosowania</h2>
            </div>
          </template>

          <create-voting-span v-model:start-time="startTime" v-model:end-time="endTime" />

          <UAlert v-if="timeError" class="bg-error text-white my-3">
            <template #title>
              Wystąpił Błąd Walidacji
            </template>
            <template #description>
              {{ timeError }}
            </template>
          </UAlert>

          <div class="flex justify-center mt-4">
            <UButton label="Przejdź do następnego kroku" icon="i-lucide-circle-arrow-right" @click="stepper?.next" />
          </div>

        </UCard>
      </template>
  
      <template #propositions>
        <UCard
          class="m-4 dark:bg-transparent mx-auto max-w-xl"
          :ui="{
            footer: 'flex justify-center'
          }"
        >
          <template #header>
            <div class="flex items-center gap-3 mb-6">
              <h2 class="text-2xl font-bold dark:text-gray-100 text-primary">Wybierz tytuł i typ głosowania</h2>
            </div>
          </template>

          <create-voting-propositions v-model:propositions="propositions" />

          <UAlert v-if="propositionError" class="bg-error text-white my-3">
            <template #title>
              Wystąpił Błąd Walidacji
            </template>
            <template #description>
              {{ propositionError }}
            </template>
          </UAlert>

          <div class="flex justify-center mt-4">
            <UButton label="Stwórz głosowanie" icon="i-lucide-circle-arrow-right" :disabled="propositions.length < 2" @click="submit" />
          </div>


        </UCard>
      </template>
    </UStepper>
  </section>
</template>

<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui';
import { ethers } from 'ethers';
import type { Ref } from 'vue';
import type { PropositionOffChain, PropositionOffChainExtend, VotingParams } from '~/types/types';

const ethereumStore = useEthereumStore();
const stepper = useTemplateRef('stepper');
const step = ref(0);

const title = ref('tytul');
const startTime = ref('');
const endTime = ref('');
const votingType = ref<0 | 1>(0);

const propositions = ref<PropositionOffChain[]>([]);

const loading = ref(false);


const items: StepperItem[] = [
  {
    slot: 'name' as const,
    title: 'Tytuł',
    description: 'Wybierz tytuł i typ głosowania',
    icon: 'i-lucide-house'
  }, {
    slot: 'span' as const,
    title: 'Czas trwania',
    description: 'Wybierz zakres czasu głosowania',
    icon: 'i-lucide-truck'
  }, {
    slot: 'propositions' as const,
    title: 'Propozycje',
    description: 'Dostosuj propozycje do głosowania'
  }
];

const countSHA = (data: string) => {
  const bytes = ethers.toUtf8Bytes(data);
  const hash = ethers.sha256(bytes);
  return hash;
};

const prepareProposition = (prop: {
  name: string;
  details: { key: string; value: string | number }[];
  img?: string;
}): PropositionOffChainExtend => {
  const minimalProp = {
    name: prop.name,
    details: prop.details,
    img: prop.img ?? ''
  };

  const hash = countSHA(JSON.stringify(minimalProp));

  return {
    ...minimalProp,
    hash
  };
};


const submit = async () => {
  // Konwersja danych do formatu kompatybilnego z blockchain
  const preparedData: VotingParams = {
    title: title.value,
    startTime: Number(Math.floor(new Date(startTime.value).getTime() / 1000)),
    endTime: Number(Math.floor(new Date(endTime.value).getTime() / 1000)),
    votingType: votingType.value,
    propositions: propositions.value.map(prepareProposition)
  };

  console.log(preparedData.startTime);
  console.log(preparedData.endTime);
  
  if(!ethereumStore.contract) {
    console.warn('problem z kontraktem');
    return;
  }
  
  try {
    validateVotingParams(preparedData);

    preparedData.metaCID = countSHA(JSON.stringify(preparedData));

    try {
      loading.value = true;

      const hashes = preparedData.propositions.map(p => p.hash);


      const res = await ethereumStore.contract.createVoting(
        preparedData.title,
        preparedData.startTime,
        preparedData.endTime,
        preparedData.votingType, 
        preparedData.metaCID,
        hashes
      );

      console.log(res);

      const res2 = await useFetchWithAuth('/api/createVote', {
        method: 'post',
        body: preparedData,
      });

      console.log(res2);

    } catch (e){
      console.error('blad podczas wysylania do blockchainu danych');
      console.error(e);
      console.error(e.reason);
    }
  } catch (e) {
    console.error(e);
  }
};

const titleError = ref('');
const votingTypeError = ref('');
const timeError = ref('');
const propositionError = ref('');

const toast = useToast();


const clearErrors = () => {
  titleError.value = '';
  votingTypeError.value = '';
  timeError.value = '';
  propositionError.value = '';
};

const throwError = (errorRef: Ref<string>, _step: number, error: string) => {
  errorRef.value = error;
  step.value = _step;

  toast.add({
    title: 'Wystąpił błąd',
    description: error,
    color: 'error',
    icon: 'i-heroicons-x-circle'
  });

  throw new Error(error);
};


const validateVotingParams = (params: VotingParams) => {
  clearErrors();

  console.log(params);
  if(!params.title) {
    throwError(titleError, 0, 'Brak tytułu');
  }

  if(params.votingType === null || params.votingType === undefined) {
    throwError(votingTypeError, 0, 'Brak ustawionego typu głosowania');
  }

  if(!params.startTime || !params.endTime) {
    throwError(timeError, 1, 'Brak daty startu lub daty końca głosowania');
  }

  if(Number.isNaN(params.startTime) || Number.isNaN(params.endTime)) {
    throwError(timeError, 1, 'Któraś z dat jest typu "NaN"');
  }

  if(params.startTime >= params.endTime) {
    throwError(timeError, 1, 'Niepoprawny zakres dat (pierwsza później niż druga)');
  }

  if(params.propositions.some(c => c.length === 0)) {
    throwError(propositionError, 2, 'Pusta lista propozycji');
  }
};

</script>
