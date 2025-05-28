// composables/useEthereum.ts
import { ethers } from 'ethers';
import abi from '~/abi.json';

export const useEthereum = () => {
  const contractAddress = '0xa00998b1c48affdebb1d1c6499857a1f262a4e66';
  
  // Reactive state
  const address = ref<string>('');
  const balance = ref<string>('');
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);
  const isInitialized = ref(false);

  // Computed
  const shortAddress = computed(() =>
    address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
  );

  // Methods
  const initializeProvider = () => {
    if (typeof window !== 'undefined' && window.ethereum) {
      provider.value = new ethers.BrowserProvider(window.ethereum);
      return true;
    }
    return false;
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    address.value = accounts[0] || '';
    await updateBalance();
  };

  const handleChainChanged = () => {
    window.location.reload();
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

      const accounts = await window.ethereum!.request({
        method: 'eth_requestAccounts'
      });

      if (!accounts.length) return;
      
      address.value = accounts[0];
      signer.value = await provider.value!.getSigner();
      
      window.ethereum!.on('accountsChanged', handleAccountsChanged);
      window.ethereum!.on('chainChanged', handleChainChanged);
      
      await updateBalance();
      
    } catch (error) {
      console.error('Błąd połączenia:', error);
      throw error;
    }
  };

  const getContract = async () => {
    if (!signer.value) {
      await connect();
    }
    return new ethers.Contract(contractAddress, abi, signer.value!);
  };

  // Initialize
  if (typeof window !== 'undefined') {
    initializeProvider();
    
    window.ethereum?.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts?.length) {
          address.value = accounts[0];
          updateBalance();
        }
        isInitialized.value = true;
      })
      .catch(console.error);
  }

  return {
    address: readonly(address),
    shortAddress: readonly(shortAddress),
    balance: readonly(balance),
    isInitialized: readonly(isInitialized),
    connect,
    getContract
  };
};