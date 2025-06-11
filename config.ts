
import { ethers } from 'ethers';
import { VotingSystem__factory, type VotingSystem } from '~/types';

export const contractAddress = '0xf8cbd27677d06daea49ff9e5214115fdbf3f0a7a';

let provider: ethers.JsonRpcProvider;
let contract: VotingSystem;

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
    contract = VotingSystem__factory.connect(contractAddress, provider);
  }
};

export const getBlockchainComponents = () => {
  if (!provider || !contract) {
    throw new Error('Połączenie z blockchain nie zostało zainicjalizowane');
  }
  return { provider, contract };
};