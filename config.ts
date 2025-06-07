
import { ethers } from 'ethers';
import { Abi__factory, type Abi } from '~/types';

export const contractAddress = '0xf1925365e426b11c63b661119a0de23b278af1e1';

let provider: ethers.JsonRpcProvider;
let contract: Abi;

export const initBlockchainConnection = () => {
  const config = useRuntimeConfig();
  
  if (!provider) {
    provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${config.INFURA_API_KEY}`,
      'sepolia',
      { staticNetwork: true }
    );
  }

  if (!contract && contractAddress) {
    contract = Abi__factory.connect(contractAddress, provider);
  }
};

export const getBlockchainComponents = () => {
  if (!provider || !contract) {
    throw new Error('Połączenie z blockchain nie zostało zainicjalizowane');
  }
  return { provider, contract };
};