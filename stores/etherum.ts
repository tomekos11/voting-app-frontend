import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import { shallowRef, computed } from 'vue';
import { whenever } from '@vueuse/core';
import { Abi__factory, type Abi } from '~/types';
import { contractAddress } from '~/config';

export const useEthereumStore = defineStore('ethereum', () => {
  // State
  const address = ref<string>('');
  const balance = ref<string>('');
  const isInitialized = ref(false);
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);

  const contract = ref<Abi | null>(null);

  const connection = ref<'not_established' | 'no_provider' | 'needs_provider_login' | 'established'>('not_established');

  // Getters
  const shortAddress = computed(() =>
    address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
  );

  const updateBalance = async () => {
    if (provider.value && address.value) {
      const bal = await provider.value.getBalance(address.value);
      balance.value = ethers.formatEther(bal);
    }
  };

  // funkcja służy do nawiązania połączenia z portfelem poprzez najczęściej kliknięcie guzika -> nie jest używana w auto-połączeniu.
  // const connect = async () => {
  //   try {
  //     if (!initializeProvider()) {
  //       connection.value = 'no_provider';
  //       console.warn('Metamask nie jest dostępny');
  //       return;
  //     }

  //     const accounts = await window.ethereum!.request({
  //       method: 'eth_requestAccounts'
  //     });

  //     if (!accounts.length) {
  //       connection.value = 'needs_provider_login';
  //       console.warn('Musisz kliknąć na portfel i potwierdzić swoje dane');
  //       return;
  //     }
      
  //     address.value = accounts[0];
  //     signer.value = await provider.value!.getSigner();

  //     connection.value = 'established';

  //     await updateBalance();

  //   } catch (error) {
  //     console.error('Błąd połączenia:', error);
  //     connection.value = 'not_established';
  //     throw error;
  //   }
  // };

  const getContract = () => {
    const runner = signer.value || provider.value;
    if (!runner) throw new Error('Brak połączenia z blockchainem');
    
    contract.value = Abi__factory.connect(contractAddress, runner);

    return contract.value;
  };


  const handleConnection = async (requestLogin = false) => {
    if (typeof window === 'undefined') return;

    try {
    // Inicjalizacja providera (możesz zunifikować tę logikę)
      if (!window.ethereum) {
        connection.value = 'no_provider';
        console.warn('@@@ MetaMask nie jest dostępny @@@');
        return;
      }

      // Wybór metody pobierania kont
      const method = requestLogin ? 'eth_requestAccounts' : 'eth_accounts';
      const accounts = await window.ethereum.request({ method });

      if (!accounts || !accounts.length) {
        connection.value = 'needs_provider_login';
        console.warn('Musisz kliknąć na portfel i potwierdzić swoje dane');
        return;
      }

      if (!provider.value) {
        provider.value = new ethers.BrowserProvider(window.ethereum);
      }

      address.value = accounts[0];
      signer.value = await provider.value.getSigner();

      // Dodatkowa logika tylko przy inicjalizacji
      if (!requestLogin) {
        getContract();
      }

      await updateBalance();
      connection.value = 'established';
    } catch (error) {
      console.error('Błąd połączenia:', error);
      connection.value = 'not_established';
      throw error;
    } finally {
      isInitialized.value = true;
      console.log('after handleConnection');
    }
  };

  // Auto-connect i śledzenie zmian
  // const init = async () => {
  //   if (typeof window === 'undefined') return;
    
  //   try {
  //     const accounts = await window.ethereum?.request({ method: 'eth_accounts' });

  //     // jesli accounts = undefined to nie ma wgl rozszerzenia metamask
  //     // jesli accounts = [] to nie podal uzytkownik hasla
      
  //     if(accounts === undefined) {
  //       connection.value = 'no_provider';
  //       throw new Error('MetaMask nie jest dostępny');
  //     }

  //     if (!accounts.length) {
  //       connection.value = 'needs_provider_login';
  //       console.warn('Musisz kliknąć na portfel i potwierdzić swoje dane');
  //       return;
  //     }

  //     if (accounts?.length) {
  //       address.value = accounts[0];
  //       provider.value = new ethers.BrowserProvider(window.ethereum);
  //       signer.value = await provider.value.getSigner();

  //       getContract();
  //       await updateBalance();
  //       connection.value = 'established';
  //     }
  //   } finally {
  //     isInitialized.value = true;
  //     console.log('after init');
  //   }
  // };

  // Reaktywne aktualizacje
  whenever(address, async () => {
    await updateBalance();
    signer.value = provider.value ? await provider.value.getSigner() : null;
  });

  // Inicjalizacja
  if (typeof window !== 'undefined') {
    console.log(12);
    // init();
    handleConnection(false);

    window.ethereum?.on('accountsChanged', ([newAddress]: string[]) => {
      address.value = newAddress || '';
    });

    window.ethereum?.on('chainChanged', () => {
      window.location.reload();
    });
  }

  const connect = () => handleConnection(true);

  return {
    // State
    address,
    balance,
    isInitialized,
    connection,
    provider,
    signer,
    contract,
    // Getters
    shortAddress,
    
    // Actions
    connect,
    updateBalance
  };
});
