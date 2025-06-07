import { whenever } from '@vueuse/core';
import { defineStore } from 'pinia';
import { shallowRef, type ShallowRef } from 'vue';
import type { Abi } from '~/types';
import type { Voting } from '~/types/types';

export const useVotingStore = defineStore('voting', () => {
  const ethereumStore = useEthereumStore();
  const contract = shallowRef<Abi | null>(null);
  
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

  const vote = async (votingId: number, propositionId: number) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    try {
    // Weryfikacja uprawnień
      const isVoter = await contract.value.voters(ethereumStore.address);
      if (!isVoter) {
        throw new Error('Brak uprawnień do głosowania');
      }

      // Wyślij transakcję
      const tx = await contract.value.vote(
        BigInt(votingId),
        BigInt(propositionId)
      );

      // Czekaj na potwierdzenie
      const receipt = await tx.wait();
      if (!receipt?.status) {
        throw new Error('Transakcja nie została potwierdzona');
      }

      // Aktualizuj dane
      //   await fetchVotings('active', 0, 5);
      //   await fetchVotings('completed', 0, 5);

      return receipt;

    } catch (error) {
      if (error instanceof Error) {
      // Specjalna obsługa błędów MetaMask
        if (error.message.includes('user rejected transaction')) {
          throw new Error('Anulowano przez użytkownika');
        }
        if (error.message.includes('insufficient funds')) {
          throw new Error('Niewystarczające środki na gaz');
        }
        if (error.message.includes('already voted')) {
          throw new Error('Już zagłosowano w tym głosowaniu');
        }
      }
      throw new Error(`Błąd głosowania: ${error instanceof Error ? error.message : 'Nieznany błąd'}`);
    }
  };


  const grantPermissionToVote = async (addres: string) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    try {
      const res = await contract.value.addVoter(addres);

      console.log(res);
      return res;
    } catch (err) {
      console.error(err);
    }

  };


  const initialize = async () => {
    if (initialized.value && ethereumStore.contract) return;

    contract.value = ethereumStore.contract;
    await Promise.all([
      checkRole(),
    //   fetchVotings('incoming', 0, 5),
    //   fetchVotings('active', 0, 5),
    //   fetchVotings('completed', 0, 5)
    ]);
    
    initialized.value = true;
  };


  // whenever(() => ethereumStore.contract, () => {
  //   initialize();
  // });

  watch(() => ethereumStore.connection, (nv) => {
    if(nv === 'established') {
      console.log('init voting');
      initialize();
    }
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

    grantPermissionToVote,
    
    vote,
    initialize,
  };
});
