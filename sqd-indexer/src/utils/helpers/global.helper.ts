import { DataHandlerContext } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";
import { Balance, Token } from "../../model";
import { inititliazeTokens } from "../entities/token";
import { TokenStats } from "../types/global.type";

export const calculateValueBD = (
  value: bigint,
  decimals: number,
  ctx: DataHandlerContext<
    Store,
    {
      log: {
        transactionHash: true;
      };
    }
  >
): number => {
  try {
    if (value === null || value === undefined) {
      ctx.log.warn("Received null or undefined value for valueBD calculation");
      return 0;
    }

    const isNegative = value < 0n;
    const absoluteValue = isNegative ? -value : value;

    const valueString = absoluteValue.toString();

    if (valueString.length > 30) {
      ctx.log.warn(
        `Value ${valueString} is too large for safe float conversion`
      );
      return 0;
    }

    const rawBD = Number(absoluteValue) / Math.pow(10, decimals);

    if (!Number.isFinite(rawBD)) {
      ctx.log.warn(
        `Invalid conversion result for value: ${valueString}, decimals: ${decimals}`
      );
      return 0;
    }

    return isNegative ? -rawBD : rawBD;
  } catch (error) {
    ctx.log.error(
      `Error calculating valueBD: ${error}, value: ${value}, decimals: ${decimals}`
    );
    return 0;
  }
};

export const getOrCreateBalance = (
  wallet: string,
  tokenAddress: string,
  blockHeight: number,
  balances: Map<string, Balance>
): Balance => {
  const id = `${wallet}-${tokenAddress}`;
  let balance = balances.get(id);
  if (!balance) {
    balance = new Balance({
      id,
      wallet,
      value: 0n,
      valueBD: 0,
      lastUpdateblock: blockHeight,
    });
    balances.set(id, balance);
  }
  return balance;
};

export const processBalanceUpdate = (
  balance: Balance,
  value: bigint,
  isAddition: boolean,
  blockHeight: number,
  tokenDecimals: number,
  ctx: any
): void => {
  balance.value = isAddition ? balance.value + value : balance.value - value;
  balance.valueBD = calculateValueBD(balance.value, tokenDecimals, ctx);
  balance.lastUpdateblock = blockHeight;
};

export const initializeTokens = async (
  isTokensInitialized: boolean,
  trackedTokens: string[],
  decimals: Map<string, number>,
  ctx: DataHandlerContext<
    Store,
    {
      log: {
        transactionHash: true;
      };
    }
  >
) => {
  if (!isTokensInitialized) {
    await inititliazeTokens(ctx, trackedTokens);

    for (const tokenAddress of trackedTokens) {
      const token = await ctx.store.get(Token, tokenAddress);
      if (!token) {
        ctx.log.error(`Failed loading token at address: ${tokenAddress}`);
        return;
      }
      decimals.set(tokenAddress, token.decimals);
    }
    isTokensInitialized = true;
  }
};

export const getTokensToUpdate = async (
  tokenStats: Map<string, TokenStats>,
  ctx: DataHandlerContext<
    Store,
    {
      log: {
        transactionHash: true;
      };
    }
  >
) => {
  return await Promise.all(
    [...tokenStats.entries()].map(async ([tokenAddress, stats]) => {
      const token = await ctx.store.get(Token, tokenAddress);
      if (!token) return null;
      token.totalTransfers += stats.transferCount;
      token.holders += stats.finalHolderCount - stats.initialHolderCount;
      return token;
    })
  ).then((tokens) => tokens.filter((t): t is Token => t !== null));
};

export const processFinalHolderCount = (
  balances: Map<string, Balance>,
  tokenStats: Map<string, TokenStats>
) => {
  for (const [id, balance] of balances) {
    const tokenAddress = balance.id.split("-")[1];
    const stats = tokenStats.get(tokenAddress);
    if (stats) {
      if (balance.value > 0n) {
        stats.finalHolderCount++;
      }
    }
  }
};
