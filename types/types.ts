export interface Detail {
    key: string;
    value: string | number;
}

export interface PropositionOffChain {
  name: string;
  img?: string;
  details: Detail[];
}

export interface Voting {
  id: number;
  title: string;
  startTime: number | string;
  endTime: number | string;
  votingType: 0 | 1 | 'Public' | 'Private';
  propositions: string[];
}

export type VotingType = 'incoming' | 'active' | 'completed';
