<template>
  <UButton @click="whoAmI">Kim jestem?</UButton>
  <div v-if="rola">
    Twoja rola: <strong>{{ rola }}</strong>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { $getContract } = useNuxtApp();

const rola = ref<string | null>(null);

const whoAmI = async () => {
  try {
    const contract = await $getContract();

    // Pobierz aktualny adres użytkownika z MetaMask
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const address = accounts[0];

    // Sprawdź role
    const chairman = await contract.chairman();
    if (address.toLowerCase() === chairman.toLowerCase()) {
      rola.value = 'Chairman';
      return;
    }

    const isAdmin = await contract.admins(address);
    if (isAdmin) {
      rola.value = 'Admin';
      return;
    }

    const isVoter = await contract.voters(address);
    if (isVoter) {
      rola.value = 'Uprawniony do głosowania';
      return;
    }

    rola.value = 'Nieuprawniony do głosowania';
  } catch (error) {
    console.error('Błąd:', error);
    rola.value = 'Błąd podczas sprawdzania roli';
  }
};
</script>