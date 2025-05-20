<template>
  <div v-if="mounted" class="fixed top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 text-center">
    <UButton 
      :label="address ? `Połączono: ${shortAddress}` : 'Połącz z MetaMask'" 
      @click="connectMetaMask" 
    />

    <div v-if="balance" class="mt-4 text-white">
      Saldo: {{ balance }} ETH
    </div>

    <UButton 
      v-if="address" 
      label="Rozłącz portfel" 
      class="mt-2" 
      @click="disconnectWallet"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { ethers } from 'ethers';

const mounted = ref(false);
const address = ref<string>('');
const balance = ref<string>('');

let provider: ethers.BrowserProvider | null = null;

// Skrócona wersja adresu
const shortAddress = computed(() => 
  address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
);

const getBalance = async (addr: string) => {
  if (!provider) return;
  const bal = await provider.getBalance(addr);
  balance.value = ethers.formatEther(bal);
};

const handleAccountsChanged = async (accounts: string[]) => {
  console.log('Accounts changed:', accounts);
  if (accounts.length === 0) {
    address.value = '';
    balance.value = '';
  } else {
    address.value = accounts[0];
    await getBalance(accounts[0]);
  }
};

const handleChainChanged = () => {
  console.log('Chain changed');
  window.location.reload();
};

const connectMetaMask = async () => {
  try {
    if (!window.ethereum || !window.ethereum.isMetaMask) {
      alert('Upewnij się, że masz zainstalowany MetaMask!');
      return;
    }

    provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });

    if (accounts.length === 0) {
      throw new Error('Brak dostępu do konta');
    }

    const signer = await provider.getSigner();
    address.value = await signer.getAddress();
    await getBalance(address.value);

    // Rejestracja listenerów
    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

  } catch (error) {
    console.error('Błąd połączenia:', error);
    const msg = (error as Error).message;
    if (msg.includes('rejected') || msg.includes('User rejected')) {
      alert('Anulowano połączenie z portfelem');
    } else {
      alert('Błąd połączenia z portfelem');
    }
  }
};

const disconnectWallet = () => {
  address.value = '';
  balance.value = '';
  if (window.ethereum) {
    window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
    window.ethereum.removeListener('chainChanged', handleChainChanged);
  }
};

// Automatyczne sprawdzenie po odświeżeniu
onMounted(async () => {
  mounted.value = true;
  if (window.ethereum && window.ethereum.isMetaMask) {
    provider = new ethers.BrowserProvider(window.ethereum);

    try {
      const accounts = await window.ethereum.request({ method: 'eth_accounts' });
      if (accounts.length > 0) {
        address.value = accounts[0];
        await getBalance(accounts[0]);

        // Eventy
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        window.ethereum.on('chainChanged', handleChainChanged);
      }
    } catch (err) {
      console.error('Błąd przy sprawdzaniu połączenia:', err);
    }
  }
});

// Czyszczenie eventów przy demontażu komponentu
onUnmounted(() => {
  if (window.ethereum) {
    window.ethereum.off('accountsChanged', handleAccountsChanged);
    window.ethereum.off('chainChanged', handleChainChanged);
  }
});
</script>
