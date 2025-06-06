// lib/blockchain.ts
import { ethers } from 'ethers';


// export const contractAddress = '0xa00998b1c48affdebb1d1c6499857a1f262a4e66';
export const contractAddress = '0xff33339cc17c98d4df6aa37b19139bacc958fac9';

// Minimalny ABI dla potrzebnych funkcji
const contractABI = [
  'function votingCount() view returns (uint256)',
  'function getVotingStatus(uint256) view returns (string)',
  'function getCandidateCount(uint256) view returns (uint256)'
];

export async function getVotingData() {
  const config = useRuntimeConfig();

  console.log(config.public);
  const infuraUrl = `https://sepolia.infura.io/v3/${config.public.INFURA_API_KEY}`;

  try {
    const provider = new ethers.JsonRpcProvider(infuraUrl);
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    
    const count = await contract.votingCount();
    const activeVotings = [];

    for (let i = 0; i < count; i++) {
      const status = await contract.getVotingStatus(i);
      if (status === 'Active') {
        const candidates = await contract.getCandidateCount(i);
        activeVotings.push({
          id: i,
          status,
          candidates
        });
      }
    }

    return {
      totalVotings: Number(count),
      activeVotings
    };
  } catch (error) {
    console.error('Blockchain error:', error);
    return null;
  }
}
