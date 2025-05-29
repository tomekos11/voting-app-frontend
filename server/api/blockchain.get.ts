import { ethers } from 'ethers';

const contractAddress = '0xa00998b1c48affdebb1d1c6499857a1f262a4e66';
const contractABI = [
  'function votingCount() view returns (uint256)',
  'function getVotingStatus(uint256) view returns (string)',
  'function getCandidateCount(uint256) view returns (uint256)'
];

export default defineEventHandler(async () => {
  const config = useRuntimeConfig();
  
  try {
    const provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${config.INFURA_API_KEY}`
    );
    
    const contract = new ethers.Contract(contractAddress, contractABI, provider);
    const count = await contract.votingCount();
    
    const activeVotings = [];
    for (let i = 0; i < count; i++) {
      const status = await contract.getVotingStatus(i);
      if (status === 'Active') {
        activeVotings.push({
          id: i,
          status,
          candidates: Number(await contract.getCandidateCount(i))
        });
      }
    }

    return {
      totalVotings: Number(count),
      activeVotings
    };
    
  } catch (error) {
    console.error('Server error:', error);
    throw createError({
      statusCode: 500,
      statusMessage: 'Blockchain connection failed'
    });
  }
});
