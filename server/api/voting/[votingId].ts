// server/api/voting/[id].ts
import { ethers } from 'ethers';
import { DateTime } from 'luxon';
import { contractAddress } from '~/config';
import { Abi__factory } from '~/types';

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const votingId = Number(getRouterParam(event, 'votingId'));

  // Walidacja konfiguracji
  if (!config.INFURA_API_KEY) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Brak klucza Infura w konfiguracji'
    });
  }

  if (!contractAddress) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Brak adresu kontraktu w konfiguracji'
    });
  }

  try {
    // Inicjalizacja połączenia z blockchain
    const provider = new ethers.JsonRpcProvider(
      `https://sepolia.infura.io/v3/${config.INFURA_API_KEY}`,
      'sepolia',
      { staticNetwork: true }
    );

    const contract = Abi__factory.connect(contractAddress, provider);

    // Pobieranie danych z blockchain
    const voting = await contract.getVoting(votingId);

    console.log(voting);
    // Konwersja danych dla klienta
    return {
      id: Number(voting.id),
      title: voting.title,
      startTime: DateTime.fromSeconds(Number(voting.startTime)).toISO(),
      endTime: DateTime.fromSeconds(Number(voting.endTime)).toISO(),
      propositions: voting.propositions,
      votingType: voting.votingType === 0 ? 'Public' : 'Private',
    //   status: await contract.getVotingStatus(votingId)
    };

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
