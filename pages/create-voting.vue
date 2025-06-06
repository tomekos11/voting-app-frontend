<template>
  <UCard
    class="m-4 bg-transparent"
    :ui="{
      footer: 'flex justify-center'
    }"
  >
    <template #header>
      Stwórz głosowanie
    </template>
    <UForm ref="form" :state="form" class="space-y-4 p-4" @submit="onSubmit">
      <!-- Tytuł głosowania -->
      <UFormField label="Tytuł głosowania" name="title" required>
        <UInput v-model="title" placeholder="Wybierz prezesa spółki" />
      </UFormField>

      <!-- Daty głosowania -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UFormField label="Czas rozpoczęcia" name="startTime" required>
          <UInput v-model="startTime" type="datetime-local" />
        </UFormField>
      
        <UFormField label="Czas zakończenia" name="endTime" required>
          <UInput v-model="endTime" type="datetime-local" />
        </UFormField>
      </div>

      <!-- Typ głosowania -->
      <UFormField label="Typ głosowania" name="votingType" required>
        <USelect
          v-model:model-value="votingType"
          :items="[
            { value: 0, label: 'Publiczne' },
            { value: 1, label: 'Prywatne' }
          ]"

          value-key="value"
          label-key="label"
        />
      </UFormField>

      <!-- Kandydaci - dynamiczna lista -->
      <UFormField label="Propozycje" class="space-y-2">
        <UButton
          label="Dodaj Propozycje"
          size="sm"
          @click="createNewProposition"
        />


        <div v-for="(_, index) in propositions" :key="index" class="mt-2">
          <Proposition 
            :index="index"
            :model-value="propositions[index]"
            @remove="deleteProposition(index)"
          />
        </div>
      </UFormField>
    </UForm>

    <template #footer>
      <UButton
        type="submit"
        label="Utwórz głosowanie"
        :disabled="propositions.length < 2"
        @click="formRef?.submit()"
      >
        <div>Utwórz głosowanie</div>
        <UTooltip>
          <UIcon name="i-lucide-circle-help" />
          <template v-if="propositions.length < 2" #content>
            Wymagane są minimalnie 2 propozycje w głosowaniu
          </template>
        </UTooltip>
      </UButton>
      
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ethers } from 'ethers';
import type { PropositionOffChain } from '~/types/types';

const { getContract } = useEthereum();

const form = ref({});

const title = ref('tytul');
const startTime = ref('');
const endTime = ref('');
const votingType = ref(0);

const propositions = ref<PropositionOffChain[]>([]);

const createNewProposition = () => {
  propositions.value.push({ name: '12345678901234567890123456789012', details: [], img: '' });
};

const formRef = useTemplateRef('form');



const onSubmit = async () => {
  // Konwersja danych do formatu kompatybilnego z blockchain
  const preparedData = {
    title: title.value,
    startTime: Math.floor(new Date(startTime.value).getTime() / 1000),
    endTime: Math.floor(new Date(endTime.value).getTime() / 1000),
    votingType: votingType.value,
    propositions: propositions.value.map(proposition => {
      const bytes = ethers.toUtf8Bytes(proposition.name);
      console.log(bytes);
      const hash = ethers.sha256(bytes);
      return hash;
    })
  };

  console.log(preparedData.startTime);
  console.log(preparedData.endTime);

  // Wywołanie smart kontraktu - przykład z użyciem Ethers.js
  // const contract = new ethers.Contract(/* ... */);
  const contract = getContract();
  
  console.log(contract);
  
  try {
    validateVotingParams(preparedData);

    try {
      await contract.createVoting(
        preparedData.title,
        preparedData.startTime,
        preparedData.endTime,
        preparedData.votingType,
        preparedData.propositions
      );
    } catch (e){
      console.error('blad podczas wysylania do blockchainu danych');
      console.error(e);
      console.error(e.reason);
    }
  } catch (e) {
    console.error(e);
  }

};

const toast = useToast();

interface VotingParams {
  title: string;
  startTime: bigint;
  endTime: bigint;
  votingType: 0 | 1;
  propositions: string[];
}

const validateVotingParams = (params: VotingParams) => {
  console.log(params);
  if(!params.title) throw new Error('No title');
  if(!params.startTime || !params.endTime) throw new Error('No start time or end time');
  if(Number.isNaN(params.startTime) || Number.isNaN(params.endTime)) throw new Error('Start time or end time cant be nan');
  if(params.startTime >= params.endTime) throw new Error('Invalid time range');
  if(params.propositions.some(c => c.length === 0)) throw new Error('Empty candidate name');
};

const deleteProposition = (index: number) => {
  try{
    propositions.value.splice(index, 1);

    toast.add({
      title: 'Usuwanie propozycji',
      description: `Poprawnie usunięto propozycje # ${index + 1}`
    });
  } catch (e) {
    console.error(e);
  }
};
</script>
