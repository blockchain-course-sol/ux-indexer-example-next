import { EvmBatchProcessor } from "@subsquid/evm-processor";
import { TypeormDatabase } from "@subsquid/typeorm-store";
import * as usdcAbi from "./abi/usdc";
import { Balance, Token } from "./model";
import {
  firstBlock,
  GATEWAY_SQD_URL,
  RPC_URL,
  trackedTokens,
} from "./utils/constants/global.constant";
import { inititliazeTokens } from "./utils/entities/token";
import { In } from "typeorm";
import {
  getOrCreateBalance,
  getTokensToUpdate,
  processBalanceUpdate,
  processFinalHolderCount,
} from "./utils/helpers/global.helper";
import { TokenStats } from "./utils/types/global.type";

const processor = new EvmBatchProcessor()
  .setGateway(GATEWAY_SQD_URL)
  .setRpcEndpoint(RPC_URL)
  .setFinalityConfirmation(75)
  .addLog({
    range: { from: firstBlock },
    address: trackedTokens,
    topic0: [usdcAbi.events.Transfer.topic],
  })
  .setFields({
    log: {
      transactionHash: true,
    },
  });

const db = new TypeormDatabase({ supportHotBlocks: true });
let isTokensInitialized = false;
const decimals = new Map<string, number>();

processor.run(db, async (ctx) => {
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

  const addresses = new Set<string>();
  const tokenStats = new Map<string, TokenStats>();

  for (const tokenAddress of trackedTokens) {
    tokenStats.set(tokenAddress, {
      transferCount: 0,
      initialHolderCount: 0,
      finalHolderCount: 0,
    });
  }

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (trackedTokens.includes(log.address)) {
        const { from, to } = usdcAbi.events.Transfer.decode(log);
        addresses.add(`${from}-${log.address}`);
        addresses.add(`${to}-${log.address}`);
        const stats = tokenStats.get(log.address);
        if (stats) {
          stats.transferCount++;
        }
      }
    }
  }

  const existingBalances = await ctx.store.findBy(Balance, {
    id: In([...addresses]),
  });

  const balances = new Map<string, Balance>();
  for (const balance of existingBalances) {
    balances.set(balance.id, balance);
    const tokenAddress = balance.id.split("-")[1];
    const stats = tokenStats.get(tokenAddress);
    if (stats) {
      if (balance.value > 0n) {
        stats.initialHolderCount++;
      }
    }
  }

  for (let block of ctx.blocks) {
    for (let log of block.logs) {
      if (trackedTokens.includes(log.address)) {
        const { from, to, value } = usdcAbi.events.Transfer.decode(log);
        const valueBigInt = BigInt(value.toString());
        const tokenDecimals = decimals.get(log.address) as number;

        const fromBalance = getOrCreateBalance(
          from,
          log.address,
          block.header.height,
          balances
        );
        const toBalance = getOrCreateBalance(
          to,
          log.address,
          block.header.height,
          balances
        );

        processBalanceUpdate(
          fromBalance,
          valueBigInt,
          false,
          block.header.height,
          tokenDecimals,
          ctx
        );
        processBalanceUpdate(
          toBalance,
          valueBigInt,
          true,
          block.header.height,
          tokenDecimals,
          ctx
        );

        if (fromBalance.value < 0n) {
          ctx.log
            .warn(`Negative balance detected at block ${block.header.height}:
            From: ${from} Balance: ${fromBalance.value}
            To: ${to} Balance: ${toBalance.value}
            Transfer Value: ${value}
          `);
        }
      }
    }
  }

  processFinalHolderCount(balances, tokenStats);

  const tokensToUpdate: Token[] = await getTokensToUpdate(tokenStats, ctx);

  await ctx.store.save(tokensToUpdate);
  await ctx.store.save([...balances.values()]);
});
