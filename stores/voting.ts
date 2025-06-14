import { defineStore } from 'pinia';
import { shallowRef, type ShallowRef } from 'vue';
import type { VotingSystem } from '~/types';
import type { Voting, VotingWithChoice } from '~/types/types';

export const useVotingStore = defineStore('voting', () => {
  const ethereumStore = useEthereumStore();
  // const contract = shallowRef<VotingSystem | null>(null);
  const contract = computed(() => ethereumStore.contract);
  
  // State
  const initialized = ref(false);
  const votingsCount = ref<bigint>(0n);
  const role = ref<'chairman' | 'admin' | 'voter' | 'unknown' | null>(null);
  
  const votings = reactive({
    incoming: [] as Voting[],
    active: [] as Voting[],
    completed: [] as Voting[]
  });

  const history = ref<VotingWithChoice[]>([]);
  const historyTotal = ref<null | number>(null);

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

    console.log(ethereumStore.address);
    console.log('check-role');

    try {
      // const [isChairman, isAdmin, isVoter] = await Promise.all([
      //   contract.value?.chairman(),
      //   contract.value?.admins(ethereumStore.address),
      //   contract.value?.voters(ethereumStore.address)
      // ]);

      // isChairman === ethereumStore.address ? 'chairman' :
      //   isAdmin ? 'admin' :
      //     isVoter ? 'voter' :
      //       'visitor';

      const _role = await contract.value?.getRole(ethereumStore.address) as 'chairman' | 'admin' | 'voter' | 'unknown';

      role.value = _role;
      console.log( role.value);
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

  const fetchHistory = async (address: string, page = 0, perPage = 10) => {
    if (!contract.value) throw new Error('Contract not initialized');
    
    const [votingData, total] = await contract.value.getVotingHistory(address, page, perPage);
    
    history.value = votingData.map(v => ({
      id: Number(v.id),
      title: v.title,
      startTime: Number(v.startTime),
      endTime: Number(v.endTime),
      propositions: v.propositions,
      choice: v.choice,
      cid: v.metaCID,
      votingType: v.votingType === 0n ? 'Public' : 'Private'
    }));

    historyTotal.value = Number(total);
        
    return { data: history.value, total: Number(total) };
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
      // const tx = await contract.value.vote(
      //   BigInt(votingId),
      //   BigInt(propositionId)
      // );

      await contract.value.vote(
        BigInt(votingId),
        BigInt(propositionId)
      );

      // Czekaj na potwierdzenie
      // const receipt = await tx.wait();
      // if (!receipt?.status) {
      //   throw new Error('Transakcja nie została potwierdzona');
      // }

      // Aktualizuj dane
      //   await fetchVotings('active', 0, 5);
      //   await fetchVotings('completed', 0, 5);

      // return receipt;
      return true;

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

  const checkPermissions = async (addres: string) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    const res = await contract.value.getRole(addres);

    return res;
  };

  const grantPermissionToVote = async (addres: string) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    const res = await contract.value.addVoter(addres);

    return res;

  };

  const revokePermissionToVote = async (addres: string) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    const res = await contract.value.removeVoter(addres);

    return res;
  };

  const grantAdminPermissions = async (addres: string) => {
    if (!contract.value) {
      throw new Error('Kontrakt nie został zainicjalizowany');
    }

    if (!ethereumStore.address) {
      throw new Error('Nie połączono z portfelem');
    }

    const res = await contract.value.addAdmin(addres);

    return res;

  };


  const initialize = async () => {
    if (initialized.value && ethereumStore.contract) return;

    await Promise.all([
      checkRole(),
    //   fetchVotings('incoming', 0, 5),
    //   fetchVotings('active', 0, 5),
    //   fetchVotings('completed', 0, 5)
    ]);
    
    initialized.value = true;
  };

  watch(() => ethereumStore.connection, (nv) => {
    if(nv === 'established') {
      console.log('init voting');
      initialize();
    }
  });

  const hasAdminPermissions = computed(() => role.value === 'admin' || role.value === 'chairman');

  return {
    initialized,
    votingsCount,
    role,
    votings,
    hasAdminPermissions,
    
    history,
    historyTotal,
    fetchHistory,

    totalPages,
    
    checkRole,
    fetchVotings,

    checkPermissions,
    grantPermissionToVote,
    revokePermissionToVote,
    grantAdminPermissions,

    vote,
    initialize,
  };
});
