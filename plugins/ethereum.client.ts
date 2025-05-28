// plugins/ethereum.client.ts
import { ethers } from 'ethers';
import abi from '~/abi.json';

export default defineNuxtPlugin(() => {
  const contractAddress = '0xa00998b1c48affdebb1d1c6499857a1f262a4e66';

  // Reactive state
  const address = ref<string>('');
  const balance = ref<string>('');
  const provider = shallowRef<ethers.BrowserProvider | null>(null);
  const signer = shallowRef<ethers.Signer | null>(null);

  // Computed
  const shortAddress = computed(() => 
    address.value ? `${address.value.slice(0, 6)}...${address.value.slice(-4)}` : ''
  );

  // Metody
  const initializeProvider = () => {
    if (window.ethereum) {
      console.log('initialized prov');
      provider.value = new ethers.BrowserProvider(window.ethereum);
    }
  };

  const handleAccountsChanged = async (accounts: string[]) => {
    address.value = accounts[0] || '';
    await updateBalance();
  };

  const handleChainChanged = () => window.location.reload();

  const updateBalance = async () => {
    if (provider.value && address.value) {
      const bal = await provider.value.getBalance(address.value);
      balance.value = ethers.formatEther(bal);
    }
  };

  const connect = async () => {
    try {
      if (!window.ethereum?.isMetaMask) {
        alert('Zainstaluj MetaMask!');
        return;
      }

      initializeProvider();
      
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      console.log(accounts);
      
      if (accounts.length === 0) return;
      
      address.value = accounts[0];
      signer.value = await provider.value!.getSigner();
      
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
      
      await updateBalance();
      
    } catch (error) {
      console.error('Błąd połączenia:', error);
      alert(error instanceof Error ? error.message : 'Nieznany błąd');
    }
  };

  const getContract = async () => {
    if (!signer.value) await connect();
    return new ethers.Contract(contractAddress, abi, signer.value!);
  };

  // Inicjalizacja
  initializeProvider();

  if (window.ethereum) {
    window.ethereum.request({ method: 'eth_accounts' })
      .then(accounts => {
        if (accounts.length > 0) {
          address.value = accounts[0];
          updateBalance();
        }
      });
  }

  return {
    provide: {
      ethereum: {
        address: readonly(address),
        shortAddress: readonly(shortAddress),
        balance: readonly(balance),
        connect,
        getContract
      }
    }
  };
});
