<template>
  <div :class="`border border-gray-400 bg-gray-50   dark:border-slate-950 dark:bg-slate-800 rounded-lg space-y-3`">
    <!-- Nagłówek -->
    <UCollapsible v-model:open="isExpanded"  disabled>
      <div :class="`flex justify-between items-center dark:hover:bg-slate-900 cursor-pointer p-3 ${isExpanded ? 'rounded-t-lg' : 'rounded-lg'}`">
        <div class="flex flex-col">
          <div class="flex gap-2 items-center">
            <UIcon v-if="isLocked" name="i-lucide-lock" />
            <h3 class="font-semibold">Propozycja #{{ index + 1 }}</h3>
  
          </div>
          <div v-if="proposition.name" class="text-sm text-gray-500">
            {{ proposition.name }}
          </div>
        </div>
        

        <div class="flex gap-2 items-center">
          <UButton
            v-if="!isLocked"
            label="Zablokuj"
            size="xs"
            color="secondary"
            icon="i-lucide-lock"
            @click.stop="isLocked = true"
          />

          <delete-proposition-modal v-if="!isLocked" :index="index" :propostion="proposition" @confirm-removing="emit('remove')"/>
        </div>
      </div>

      <template #content>
        <div class="p-4">
          <!-- Nazwa propozycji -->
          <UFormField label="Nazwa" required>
            <UInput
              v-model="proposition.name"
              :disabled="isLocked"
              placeholder="Nazwa systemu głosowania"
            />
          </UFormField>

          <!-- Zdjęcie -->
          <UFormField label="Zdjęcie (Base64)" class="relative mt-3">
            <UInput
              ref="fileInput"
              type="file"
              accept="image/*"
              :disabled="isLocked"
              @change="handleImageUpload"
            />

            <img
              v-if="proposition.img" 
              :src="proposition.img" 
              class="mt-2 max-h-32 object-contain"
            >
          </UFormField>

          <!-- Dynamiczne detale -->
          <UFormField label="Dodatkowe dane o propozycji" class="mt-3">
            <div v-for="(detail, i) in proposition.details" :key="i" class="flex gap-2 mb-2">
              <UInput
                v-model="detail.key"
                placeholder="Parametr (np. hash algorithm)"
                class="flex-1"
                :disabled="isLocked"
              />
              <UInput
                v-model="detail.value"
                placeholder="Wartość (np. SHA-256)"
                class="flex-1"
                :disabled="isLocked"
              />

              <UButton
                v-if="!isLocked"
                icon="i-heroicons-x-mark"
                size="xs"
                color="error"
                variant="ghost"
                @click="removeDetail(i)"
              />
            </div>
      
            <UButton
              v-if="!isLocked"
              label="Dodaj parametr"
              size="xs"
              class="mt-2"
              icon="i-lucide-circle-plus"
              @click="addDetail"
            />

            <UButton
              v-if="isLocked"
              label="Odblokuj"
              size="xs"
              color="secondary"
              icon="i-lucide-lock-open"
              @click.stop="isLocked = false"
            />
          </UFormField>
        </div>
      </template>
    </UCollapsible>
  </div>
</template>

<script setup lang="ts">
import type { PropositionOffChain } from '~/types/types';


defineProps<{
  index: number
}>();

const proposition = defineModel<PropositionOffChain>({
  required: true
});

const isLocked = ref(false);
const isExpanded = ref(true);

const emit = defineEmits(['remove']);

const handleImageUpload = async (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      proposition.value.img = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};
const availableKeys = [
  'Imie kandydata',
  'Drugie imie kandydata',
  'Nazwisko kandydata',
  'Wiek kandydata',
  'Imie ojca',
  'Imie matki',
];

const addDetail = () => {
  proposition.value.details.push({ key: '', value: '' });
};

const removeDetail = (index: number) => {
  proposition.value.details.splice(index, 1);
};

defineExpose({
  collapse: () => isExpanded.value = false
});
</script>