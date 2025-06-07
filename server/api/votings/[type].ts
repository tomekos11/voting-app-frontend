import { getBlockchainComponents, initBlockchainConnection } from '~/config';
import type { Abi } from '~/types';
import type { Voting, VotingType } from '~/types/types';

interface Response {
    data: Voting[],
    pagination: {
        page: number;
        perPage: number;
        total: number;
    }
}

export default defineEventHandler(async (event) => {
  if (process.env.NODE_ENV === 'development') {
    event.node.res.setHeader(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    );
    event.node.res.setHeader('Pragma', 'no-cache');
    event.node.res.setHeader('Expires', '0');
  } else {
    event.node.res.setHeader(
      'Cache-Control',
      'public, max-age=300, stale-while-revalidate=60'
    );
  }

  initBlockchainConnection();
  const { contract } = getBlockchainComponents();
  
  
  const { type } = getRouterParams(event);
  const { page = '1', perPage = '10' } = getQuery(event);

  // Walidacja parametrów
  if (!['incoming', 'active', 'completed'].includes(type)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Nieprawidłowy typ głosowania'
    });
  }

  try {
    const methodMap: Record<VotingType, keyof Abi> = {
      incoming: 'getIncomingVotings',
      active: 'getActiveVotings',
      completed: 'getCompletedVotings'
    };

    const [votingData, total] = await contract[methodMap[type as VotingType]](
      Number(page),
      Number(perPage)
    );

    const response: Response = {
      data: votingData.map(v => ({
        id: Number(v.id),
        title: v.title,
        startTime: Number(v.startTime),
        endTime: Number(v.endTime),
        propositions: v.propositions
      })),
      pagination: {
        page: Number(page),
        perPage: Number(perPage),
        total: Number(total)
      }
    };

    return response;
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Nieznany błąd';
    throw createError({
      statusCode: 500,
      message: `Błąd blockchain: ${message}`
    });
  }
});