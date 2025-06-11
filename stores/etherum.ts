import { defineStore, skipHydrate } from 'pinia';
import { ethers } from 'ethers';
import { shallowRef, computed } from 'vue';
import { whenever } from '@vueuse/core';
import { Abi__factory, type Abi } from '~/types';
import { contractAddress } from '~/config';

export const useEthereumStore = defineStore('ethereum', () => {
  // State
  const address = ref<string>('');
  const balance = ref<string>('');
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);

  const contract = ref<Abi | null>(null);

  const connection = ref<'problems_with_wallet' | 'no_provider' | 'needs_provider_login' | 'established' | null>(null);

  const errorCode = ref<null | number>(null);

  const init = () => handleConnection(false);
  const connect = () => handleConnection(true);
  
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

  const getContract = () => {
    const runner = signer.value || provider.value;
    if (!runner) throw new Error('Brak połączenia z blockchainem');
    
    contract.value = Abi__factory.connect(contractAddress, runner);

    return contract.value;
  };


  const handleConnection = async (requestLogin = false) => {
    if (typeof window === 'undefined') {
      return;
    }

    errorCode.value = null;

    try {
    // Inicjalizacja providera (możesz zunifikować tę logikę)
      if (!window.ethereum) {
        connection.value = 'no_provider';

        if(requestLogin) {
          errorCode.value = 2137;
        }

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
      connection.value = 'problems_with_wallet';
      errorCode.value = error.code;
      throw error;
    } finally {
      console.log('after handleConnection');
    }
  };

  // Reaktywne aktualizacje
  whenever(address, async () => {
    await updateBalance();
    signer.value = provider.value ? await provider.value.getSigner() : null;
  });

  const showLoginButton = computed(() => (connection.value === 'needs_provider_login' || connection.value === 'problems_with_wallet'));
  const showDownloadMetamaskButton = computed(() => connection.value === 'needs_provider_login');

  // Inicjalizacja
  if (typeof window !== 'undefined') {
    console.log(12);
    init();

    window.ethereum?.on('accountsChanged', ([newAddress]: string[]) => {
      // address.value = newAddress || '';
      console.log('accountsChanged');
    });

    window.ethereum?.on('chainChanged', () => {
      // window.location.reload();
      console.log('accountsChanged');
    });
  }

  return {
    // State
    address: skipHydrate(address),
    balance: skipHydrate(balance),
    connection: skipHydrate(connection),
    provider: skipHydrate(provider),
    signer: skipHydrate(signer),
    contract,
    // Getters
    shortAddress: skipHydrate(shortAddress),
    errorCode: skipHydrate(errorCode),
    
    showDownloadMetamaskButton: skipHydrate(showDownloadMetamaskButton),
    showLoginButton: skipHydrate(showLoginButton),

    // Actions
    connect,
    updateBalance
  };
});
