<template>
  <div>
    <UFormField
      label="Propozycje"
      class="space-y-2"
      description="Propozycje po utworzeniu głosowania są niezmienne i nieusuwalne. Zastanów się co tutaj wpisać. Można tworzyć dowolne pola i wartości"
      :error="propositions.length < 2 ? 'Wymagane są co najmniej 2 propozycje' : undefined"
    >
      <UButton
        :label="`Dodaj Propozycje nr ${propositions.length + 1}`"
        size="sm"
        @click="createNewProposition"
      />


      <div v-for="(_, index) in propositions" :key="index" class="mt-2">
        <Proposition
          :ref="el => setPropositionRef(el, index)"
          :index="index"
          :model-value="propositions[index]"
          @remove="deleteProposition(index)"
        />
      </div>
    </UFormField>
  </div>
</template>

<script setup lang="ts">
import type { PropositionOffChain } from '~/types/types';

const propositions = defineModel<PropositionOffChain[]>('propositions', {
  required: true
});

const propositionsRef = ref([]);

const setPropositionRef = (el, idx) => {
  if (el) {
    propositionsRef.value[idx] = el;
  } else {
    // Czyszczenie referencji, gdy komponent jest usuwany
    propositionsRef.value.splice(idx, 1);
  }
};

const toast = useToast();

const createNewProposition = () => {
  console.log( propositionsRef.value);

  if( propositionsRef.value) {
    propositionsRef.value.forEach(el => el.collapse());
  }

  propositions.value.push({ name: '12345678901234567890123456789012', details: [], img: '' });
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