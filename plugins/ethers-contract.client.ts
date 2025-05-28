import { ethers } from 'ethers';
import abi from '~/abi.json';

export default defineNuxtPlugin(() => {
  const contractAddress = '0xa00998b1c48affdebb1d1c6499857a1f262a4e66';

  const getContract = async () => {
    // Sprawdź, czy MetaMask jest zainstalowany
    if (window.ethereum && window.ethereum.isMetaMask) {
      try {
        // Poproś o dostęp do konta (jeśli jeszcze nie połączono)
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        
        // Inicjalizuj provider i signera
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        // Utwórz instancję kontraktu
        const contract = new ethers.Contract(contractAddress, abi, signer);
        return contract;

      } catch (error) {
        console.error('Błąd podczas łączenia z MetaMask:', error);
        throw error;
      }
    } else {
      throw new Error('Zainstaluj MetaMask, aby korzystać z tej aplikacji');
    }
  };

  // Udostępnij funkcję w całej aplikacji
  return {
    provide: {
      getContract
    }
  };
});