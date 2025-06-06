// lib/blockchain.ts
import { ethers } from 'ethers';
import { contractABI, contractAddress } from '~/config';


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
