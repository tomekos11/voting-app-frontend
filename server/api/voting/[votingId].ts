import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { getBlockchainComponents, initBlockchainConnection  } from '~/config';
import type { Voting } from '~/types/types';


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
  
  const rawVotingId = getRouterParam(event, 'votingId');

  if(!rawVotingId) {
    throw createError({
      statusCode: 500,
      message: 'Brak wymaganego parametru votingId'
    });
  }

  const votingId = ethers.getBigInt(rawVotingId);

  try {
    console.log(votingId);
    const voting =  await contract.getVoting(votingId);

    const response: Voting = {
      id: Number(voting.id),
      title: voting.title,
      cid: voting.metaCID,
      startTime: DateTime.fromSeconds(Number(voting.startTime)).toISO(),
      endTime: DateTime.fromSeconds(Number(voting.endTime)).toISO(),
      propositions: voting.propositions,
      votingType: voting.votingType === 0 ? 'Public' : 'Private',
    };

    return response;

  } catch (error) {
    // Specjalna obsługa błędów blockchain
    const message = error instanceof Error ? error.message : 'Nieznany błąd';
    
    if (message.includes('Results pending')) {
      return {
        status: 'pending',
        message: 'Wyniki w trakcie weryfikacji'
      };
    }

    throw createError({
      statusCode: 500,
      message: `Błąd blockchain: ${message}`
    });
  }
});
