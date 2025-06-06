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
  startTime: number;
  endTime: number;
  propositions: string[];
}