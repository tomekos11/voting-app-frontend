import { defineStore } from 'pinia';
import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { VotingSystem__factory, type VotingSystem } from '~/types';
import type { Voting } from '~/types/types';

interface ActiveVoting {
  id: number;
  status: string;
  candidates: number;
}

export const useInfuraStore = defineStore('infura', () => {
  // State
  const provider = shallowRef<ethers.JsonRpcProvider>();
  const contract = shallowRef<VotingSystem>();
  const loading = ref(true);
  const error = ref<string | null>(null);

  // Actions
  const initProvider = async () => {
    const config = useRuntimeConfig();
    
    try {
      if (!config.public.INFURA_API_KEY) {
        throw new Error('Missing Infura API key in configuration');
      }

      // Inicjalizacja tylko po stronie klienta
      if (import.meta.server) return;

      provider.value = new ethers.JsonRpcProvider(
        `https://sepolia.infura.io/v3/${config.public.INFURA_API_KEY}`,
        'sepolia',
        { staticNetwork: true }
      );

      await provider.value.ready;
      
      contract.value = VotingSystem__factory.connect(
        config.public.CONTRACT_ADDRESS,
        provider.value
      );

    } catch (err) {
      error.value = `Initialization error: ${err instanceof Error ? err.message : 'Unknown error'}`;
      console.error('Infura init error:', err);
    } finally {
      loading.value = false;
    }
  };

  const fetchVotingData = async (id: number): Promise<Voting | 'results_pending' | null> => {
    if (!contract.value) return null;

    try {
      const voting = await contract.value.getVoting(id);
      
      // Walidacja struktury danych
      if (!voting?.exists || voting.startTime >= voting.endTime) {
        throw new Error('Invalid voting structure');
      }

      return {
        id: Number(voting.id),
        title: voting.title,
        startTime: DateTime.fromSeconds(Number(voting.startTime)),
        endTime: DateTime.fromSeconds(Number(voting.endTime)),
        propositions: voting.propositions,
        votingType: voting.votingType === 0 ? 'Public' : 'Private'
      };

    } catch (err) {
      if (err instanceof Error && err.message.includes('Results pending')) {
        return 'results_pending';
      }
      console.error('Fetch error:', err);
      return null;
    }
  };

  // Automatyczna inicjalizacja po stronie klienta
  if (import.meta.client) {
    initProvider();
  }

  return {
    provider: readonly(provider),
    contract: readonly(contract),
    loading: readonly(loading),
    error: readonly(error),
    initProvider,
    fetchVotingData
  };
});
