export interface Token {
  id: string;
  tokenAddress: string;
  symbol: string;
  name: string;
  decimals: number;
  totalSupply: string;
  totalTransfers: number;
  holders: number;
}

export interface Balance {
  id: string;
  wallet: string;
  value: string;
  valueBD: number;
  lastUpdateblock: number;
}
