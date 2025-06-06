// composables/useEthereum.ts
import { ethers } from 'ethers';
import { Abi__factory } from '~/types';

const address = ref<string>('');
const isInitialized = ref(false);
const walletConnected = ref(false);

export const useEthereum = () => {
  
  const balance = ref<string>('');
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);

  const shortAddress = computed(() =>
    address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
  );

  const initializeProvider = () => {
    if (import.meta.client && window.ethereum) {
      provider.value = new ethers.BrowserProvider(window.ethereum);
      return true;
    }
    return false;
  };

  // const handleAccountsChanged = async (accounts: string[]) => {
  //   address.value = accounts[0] || '';
  //   await updateBalance();
  // };

  // const handleChainChanged = () => {
  //   window.location.reload();
  // };

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
      
      // window.ethereum!.on('accountsChanged', handleAccountsChanged);
      // window.ethereum!.on('chainChanged', handleChainChanged);
      
      await updateBalance();
      walletConnected.value = true;

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

  // Initialize
  if (import.meta.client) {
    initializeProvider();
    
    // Auto-connect jeśli portfel już podłączony
    window.ethereum?.request({ method: 'eth_accounts' })
      .then(async accounts => {
        if (accounts?.length) {
          address.value = accounts[0];
          signer.value = await provider.value!.getSigner();
          await updateBalance();
          walletConnected.value = true;
        }
        isInitialized.value = true;
      })
      .catch(console.error);
  }

  watch(address, (nv) => {
    console.log(nv);
  });

  return {
    address: readonly(address),
    shortAddress: readonly(shortAddress),
    balance: readonly(balance),
    isInitialized: readonly(isInitialized),
    walletConnected: readonly(walletConnected),
    connect,
    getContract
  };
};
