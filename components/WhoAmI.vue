<template>
  <UButton @click="whoAmI">Kim jestem?</UButton>
  <div v-if="role">
    Twoja rola: <strong>{{ role }}</strong>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const { address, connect,  getContract } = useEthereum(); // Używaj 'ethereum', nie '$ethereum'

const role = ref<string | null>(null);

const whoAmI = async () => {
  try {
    // Upewnij się, że użytkownik jest połączony z portfelem
    if (!address.value) {
      await connect();
    }

    const contract = await getContract();

    // Sprawdź role
    const chairman = await contract.chairman();
    if (address.value.toLowerCase() === chairman.toLowerCase()) {
      role.value = 'Chairman';
      return;
    }

    const isAdmin = await contract.admins(address);
    if (isAdmin) {
      role.value = 'Admin';
      return;
    }

    const isVoter = await contract.voters(address);
    if (isVoter) {
      role.value = 'Uprawniony do głosowania';
      return;
    }

    role.value = 'Nieuprawniony do głosowania';
  } catch (error) {
    console.error('Błąd:', error);
    role.value = 'Błąd podczas sprawdzania roli';
  }
};
</script>
