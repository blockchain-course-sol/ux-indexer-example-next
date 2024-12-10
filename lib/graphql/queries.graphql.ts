import { gql } from "@apollo/client";

export const GET_ALL_TOKENS = gql`
  query GetAllTokens {
    tokens {
      id
      tokenAddress
      symbol
      name
      decimals
      totalSupply
      totalTransfers
      holders
    }
  }
`;

export const GET_BALANCES_BY_WALLET = gql`
  query GetBalancesByWallet($wallet: String!) {
    balances(where: { wallet_eq: $wallet }) {
      id
      lastUpdateblock
      value
      valueBD
      wallet
    }
  }
`;
