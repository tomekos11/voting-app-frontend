import { whenever } from '@vueuse/core';
import type { Abi } from '~/types';

const initialized = ref(false);
const contract = shallowRef<Abi>();
const votingsCount = ref<bigint | null>(null);
const role = ref<'chairman' | 'admin' | 'voter' | 'visitor' | null>();

export const useVoting = () => {
  const { getContract } = useEthereum();
  const { address, isInitialized } = toRefs(useEthereum());

  const checkRole = async () => {
    try {
      if (!address.value) {
        role.value = null;
        return;
      }
    
      if (!contract.value) return;

      const chairman = await contract.value.chairman();
      if (address.value?.toLowerCase() === chairman.toLowerCase()) {
        role.value = 'chairman';
        return;
      }

      const isAdmin = await contract.value.admins(address.value);
      if (isAdmin) {
        role.value = 'admin';
        return;
      }

      const isVoter = await contract.value.voters(address.value);
      if (isVoter) {
        role.value = 'voter';
        return;
      }

      role.value = 'visitor';
    } catch (error) {
      console.error('Błąd:', error);
    }
  };

  const getVotingsCount = async () => {
    if (!address.value) {
      votingsCount.value = BigInt(0);
      return;
    }
      
    if (!contract.value) return;
    
    votingsCount.value = await contract.value.votingCount();
    console.log('Votings count:', votingsCount.value);
  };

  const initialize = async () => {
    if (initialized.value) return;
    
    if (!isInitialized.value) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    contract.value = getContract();
    await Promise.all([checkRole(), getVotingsCount()]);
    
    initialized.value = true;
  };

  onMounted(initialize);

  whenever(address, async () => {
    contract.value = getContract();
    await Promise.all([checkRole(), getVotingsCount()]);
  });

  return {
    role: readonly(role),
    votingsCount: readonly(votingsCount),
    initialized: readonly(initialized),
    checkRole,
    getVotingsCount,
    initialize
  };
};
