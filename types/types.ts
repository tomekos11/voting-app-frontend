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
  cid: string;
  startTime: number | string;
  endTime: number | string;
  votingType: 0 | 1 | 'Public' | 'Private';
  propositions: string[];
}

export interface PropositionOffChainExtend extends PropositionOffChain {
  hash: string;
}

export interface VotingParams {
  metaCID?: string;
  title: string;
  startTime: number;
  endTime: number;
  votingType: 0 | 1;
  propositions: PropositionOffChainExtend[];
}