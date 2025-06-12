<template>
  <secured-page>
    <div class="flex flex-col items-center justify-center min-h-[80svh] space-y-4 max-w-md mx-auto">
      <!-- <div class="flex flex-col gap-4 max-w-md mx-auto p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg"> -->
      <UForm :state="{}" class="flex flex-col gap-4 rounded-xl p-3">
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
          <UButton color="primary" variant="ghost" :disabled="!address" @click="grantAdminPermissions">
            Mianuj adminem
          </UButton>
          <UButton color="error" variant="outline" :disabled="!address" @click="revokePermissions">
            Zabierz uprawnienia
          </UButton>
          <UButton color="secondary" variant="outline" :disabled="!address" @click="checkPermissions">
            Sprawdź uprawnienia
          </UButton>
        </div>
      </UForm>
      
      <UAlert v-if="error" :color="resultColor" class="mt-2">
        <template #title>
          Wynik operacji
        </template>
        <template #description>
          <div>
            <b>Error code:</b> {{ error.code }}
          </div>
          <div>
            <b>Error message:</b> {{ error.reason }}
          </div>
          <div v-if="error.code === 'UNCONFIGURED_NAME' || error.code === 'INVALID_ARGUMENT'">
            <b>Wytłumaczenie:</b> Adres jest niepoprawny. Rollback.
          </div>
        </template>
      </UAlert>
  
      <UCollapsible v-model:open="showResult">
        <template #content>
          {{ result }}
        </template>
      </UCollapsible>

    </div>

  </secured-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const address = ref('');
const result = ref('');
const resultColor = ref('primary');

const votingStore = useVotingStore();
const error = ref<null>(null);


const showResult = computed({
  get: () => !!result.value,
  set: () => result.value = ''
});

const grantPermissions = async () => {
  error.value = null;

  try {
    const res = await votingStore.grantPermissionToVote(address.value);

    result.value = 'Poprawnie nadano uprawnienia';
  } catch (e) {
    console.log(e);
    error.value = e;
  }
};

const grantAdminPermissions = async () => {
  error.value = null;

  try {
    const res = await votingStore.grantAdminPermissions(address.value);

    result.value = 'Poprawnie nadano uprawnienia admina';
  } catch (e) {
    console.log(e);
    error.value = e;
  }
};

const revokePermissions = async () => {
  error.value = null;

  try {
    const res = await votingStore.revokePermissionToVote(address.value);
    result.value = 'Poprawnie odebrano uprawnienia';
  } catch (e) {
    console.log(e);
    error.value = e;
  }
};

const checkPermissions = async () => {
  error.value = null;

  try {
    const res = await votingStore.checkPermissions(address.value);
    result.value = res;
  } catch (e) {
    console.log(e);
    error.value = e;
    console.log(error.value);
  }
};
</script>
