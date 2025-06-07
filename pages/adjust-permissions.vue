<template>
  <div class="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg">
    <UForm :state="{}" class="flex flex-col gap-4">
      <UFormField label="Adres użytkownika" name="address">
        <UInput
          v-model="address"
          placeholder="Wprowadź adres portfela"
          color="primary"
          class="w-full"
          highlight
        />
      </UFormField>
      <div class="flex gap-2">
        <UButton color="primary" :disabled="!address" @click="grantPermissions">
          Nadaj uprawnienia
        </UButton>
        <UButton color="error" variant="outline" :disabled="!address" @click="revokePermissions">
          Zabierz uprawnienia
        </UButton>
        <UButton color="secondary" variant="outline" :disabled="!address" @click="checkPermissions">
          Sprawdź uprawnienia
        </UButton>
      </div>
    </UForm>
    {{ error?.data || 'xd' }}
    <UAlert v-if="error" :color="resultColor" class="mt-2">
      <template #title>
        Wynik operacji
      </template>
      <template #description>
        <div v-if="error.code === 'UNCONFIGURED_NAME'">
          Adres jest niepoprawny. Rollback.
        </div>
      </template>
    </UAlert>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const address = ref('');
const result = ref('');
const resultColor = ref('primary');

const votingStore = useVotingStore();
const error = ref<null>(null);

function grantPermissions() {
  // tu logika nadawania uprawnień
  try {
    const res = votingStore.grantPermissionToVote(address.value);
  } catch (e) {
    console.log(e);
    error.value = e;
  }
  
}

function revokePermissions() {
  // tu logika odbierania uprawnień
  result.value = `Odebrano uprawnienia dla adresu ${address.value}`;
  resultColor.value = 'red';
}

function checkPermissions() {
  // tu logika sprawdzania uprawnień
  // przykładowy wynik:
  result.value = `Adres ${address.value} posiada uprawnienia`;
  resultColor.value = 'gray';
}
</script>
