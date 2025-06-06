<template>
  <div>
    <UButton
      label="Usuń"
      size="xs"
      icon="i-heroicons-trash"
      color="error"
      @click.stop="showModal = true"
    />

    <UModal
      v-model:open="showModal"
      :ui="{
        footer: 'justify-end'
      }"
      title="Usuwanie propozycji"
    >
      <template #body>
        <div>
          Czy na pewno chcesz usunąć <b class="text-error">Propozycje #{{ index + 1 }} </b> o nazwie <b class="text-error"> {{ propostion.name }}</b>?
        </div>
      </template>

      <template #footer>
        <UButton
          label="Anuluj"
          size="xs"
          color="info"
          @click.stop="showModal = false"
        />

        <UButton
          label="Usuń"
          size="xs"
          icon="i-heroicons-trash"
          color="error"
          @click.stop="confirmRemoving"
        />
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { PropositionOffChain } from '~/types/types';

const props = defineProps<{
  index: number;
  propostion: PropositionOffChain;
}>();

const emit = defineEmits(['confirmRemoving']);

const showModal = ref(false);

const confirmRemoving = () => {
  emit('confirmRemoving', props.index);

  showModal.value = false;
};

</script>