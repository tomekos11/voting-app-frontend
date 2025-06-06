// stores/ethereum.ts
import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import { shallowRef, computed } from 'vue';
import { whenever } from '@vueuse/core';
import { Abi__factory } from '~/types';
import { contractAddress } from '~/config';

export const useEthereumStore = defineStore('ethereum', () => {
  // State
  const address = ref<string>('');
  const balance = ref<string>('');
  const isInitialized = ref(false);
  const walletConnected = ref(false);
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);

  // Getters
  const shortAddress = computed(() =>
    address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
  );

  // Actions
  const initializeProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      provider.value = new ethers.BrowserProvider(window.ethereum);
      return true;
    }
    return false;
  };

  const updateBalance = async () => {
    if (provider.value && address.value) {
      const bal = await provider.value.getBalance(address.value);
      balance.value = ethers.formatEther(bal);
    }
  };

  const connect = async () => {
    try {
      if (!initializeProvider()) {
        throw new Error('MetaMask nie jest dostępny');
      }

      console.log(1);
      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts.length) return;
      
      address.value = accounts[0];
      signer.value = await provider.value!.getSigner();
      walletConnected.value = true;
      await updateBalance();

    } catch (error) {
      console.error('Błąd połączenia:', error);
      walletConnected.value = false;
      throw error;
    }
  };

  const getContract = () => {
    const runner = signer.value || provider.value;
    if (!runner) throw new Error('Brak połączenia z blockchainem');
    
    return Abi__factory.connect(contractAddress, runner);
  };

  // Auto-connect i śledzenie zmian
  const init = async () => {
    if (typeof window === 'undefined') return;
    
    try {
      const accounts = await window.ethereum?.request({ method: 'eth_accounts' });
      if (accounts?.length) {
        address.value = accounts[0];
        provider.value = new ethers.BrowserProvider(window.ethereum);
        signer.value = await provider.value.getSigner();
        await updateBalance();
        walletConnected.value = true;
      }
    } finally {
      isInitialized.value = true;
      console.log('after init');
    }
  };

  // Reaktywne aktualizacje
  whenever(address, async () => {
    await updateBalance();
    signer.value = provider.value ? await provider.value.getSigner() : null;
  });

  // Inicjalizacja
  if (typeof window !== 'undefined') {
    console.log(12);
    init();
    
    window.ethereum?.on('accountsChanged', ([newAddress]: string[]) => {
      address.value = newAddress || '';
    });

    window.ethereum?.on('chainChanged', () => {
      window.location.reload();
    });
  }

  return {
    // State
    address,
    balance,
    isInitialized,
    walletConnected,
    provider,
    signer,
    
    // Getters
    shortAddress,
    
    // Actions
    connect,
    getContract,
    updateBalance
  };
});
