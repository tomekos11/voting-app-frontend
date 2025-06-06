// stores/voting.ts
import { defineStore } from 'pinia';
import { shallowRef, type ShallowRef } from 'vue';
import type { Abi } from '~/types';
import type { Voting } from '~/types/types';

export const useVotingStore = defineStore('voting', () => {
  const ethereumStore = useEthereumStore();
  const contract = shallowRef<Abi>();
  
  // State
  const initialized = ref(false);
  const votingsCount = ref<bigint>(0n);
  const role = ref<'chairman' | 'admin' | 'voter' | 'visitor' | null>(null);
  
  const votings = reactive({
    incoming: [] as Voting[],
    active: [] as Voting[],
    completed: [] as Voting[]
  });

  // Getters
  const totalPages = computed(() => (perPage: number) => ({
    incoming: Math.ceil(votings.incoming.length / perPage),
    active: Math.ceil(votings.active.length / perPage),
    completed: Math.ceil(votings.completed.length / perPage)
  }));

  // Actions
  const checkRole = async () => {
    if (!ethereumStore.address) {
      role.value = null;
      return;
    }

    try {
      const [isChairman, isAdmin, isVoter] = await Promise.all([
        contract.value?.chairman(),
        contract.value?.admins(ethereumStore.address),
        contract.value?.voters(ethereumStore.address)
      ]);

      role.value = isChairman === ethereumStore.address ? 'chairman' :
        isAdmin ? 'admin' :
          isVoter ? 'voter' :
            'visitor';
    } catch (error) {
      console.error('Role check error:', error);
      role.value = null;
    }
  };

  const fetchVotings = async (type: 'incoming' | 'active' | 'completed', page: number, perPage: number) => {
    if (!contract.value) throw new Error('Contract not initialized');
    
    const methodMap = {
      incoming: 'getIncomingVotings',
      active: 'getActiveVotings',
      completed: 'getCompletedVotings'
    };

    const [votingData, total] = await contract.value[methodMap[type]](page, perPage);
    
    votings[type] = votingData.map(v => ({
      id: Number(v.id),
      title: v.title,
      startTime: Number(v.startTime),
      endTime: Number(v.endTime),
      propositions: v.propositions
    }));

    return { data: votings[type], total: Number(total) };
  };

  const initialize = async () => {
    if (initialized.value) return;

    contract.value = ethereumStore.getContract();
    await Promise.all([
      checkRole(),
    //   fetchVotings('incoming', 0, 5),
    //   fetchVotings('active', 0, 5),
    //   fetchVotings('completed', 0, 5)
    ]);
    
    initialized.value = true;
  };


  watch(() => ethereumStore.getContract(), () => {
    initialize();
  });

  return {
    // State
    contract: contract as ShallowRef<Abi>,
    initialized,
    votingsCount,
    role,
    votings,
    
    // Getters
    totalPages,
    
    // Actions
    checkRole,
    fetchVotings,
    initialize
  };
});
