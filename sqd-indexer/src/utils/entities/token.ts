import { assertNotNull } from "@subsquid/util-internal";
import { Multicall } from "../../abi/multicall";
import { Token } from "../../model";
import { MULTICALL_ADDRESS } from "../constants/global.constant";
import { BlockContext } from "@subsquid/evm-abi/lib/contract-base";
import { functions } from "../../abi/usdc";
import { DataHandlerContext } from "@subsquid/evm-processor";
import { Store } from "@subsquid/typeorm-store";

export const inititliazeTokens = async (
  mctx: DataHandlerContext<
    Store,
    {
      log: {
        transactionHash: true;
      };
    }
  >,
  newTokens: string[]
) => {
  const ctx = {
    _chain: mctx._chain,
    block: { ...mctx.blocks[mctx.blocks.length - 1].header, height: 20519002 },
  };

  const [symbols, names, decimals, totalSupplies] = await Promise.all([
    fetchTokensSymbol(ctx, newTokens),
    fetchTokensName(ctx, newTokens),
    fetchTokensDecimals(ctx, newTokens),
    fetchTokensTotalSupply(ctx, newTokens),
  ]);

  const newTokensEntities = [];

  for (let i = 0; i < newTokens.length; i++) {
    const tokenAddress = newTokens[i];

    const decimalsToken = assertNotNull(decimals.get(tokenAddress));
    const totalSupply = assertNotNull(totalSupplies.get(tokenAddress));

    const totalSupplyInTokens =
      BigInt(totalSupply) / BigInt(10 ** decimalsToken);

    newTokensEntities.push(
      new Token({
        id: tokenAddress,
        tokenAddress: tokenAddress,
        symbol: assertNotNull(symbols.get(tokenAddress)),
        name: assertNotNull(names.get(tokenAddress)),
        decimals: decimalsToken,
        totalSupply: totalSupplyInTokens,
        totalTransfers: 0,
        holders: 0,
      })
    );
  }

  await mctx.store.upsert(newTokensEntities);
};

const fetchTokensSymbol = async (ctx: BlockContext, newTokens: string[]) => {
  const multicall = new Multicall(ctx, MULTICALL_ADDRESS);

  const results = await multicall.tryAggregate(
    functions.symbol,
    newTokens.map((tokenAddress) => [tokenAddress, {}])
  );

  const symbols = new Map<string, string>(
    results.map((result, index) => [
      newTokens[index],
      result.success ? result.value ?? "" : "",
    ])
  );

  return symbols;
};

const fetchTokensName = async (ctx: BlockContext, newTokens: string[]) => {
  const multicall = new Multicall(ctx, MULTICALL_ADDRESS);

  const results = await multicall.tryAggregate(
    functions.name,
    newTokens.map((tokenAddress) => [tokenAddress, {}])
  );

  const names = new Map<string, string>(
    results.map((result, index) => [
      newTokens[index],
      result.success ? result.value ?? "" : "",
    ])
  );
  return names;
};

const fetchTokensDecimals = async (ctx: BlockContext, newTokens: string[]) => {
  const multicall = new Multicall(ctx, MULTICALL_ADDRESS);

  const results = await multicall.tryAggregate(
    functions.decimals,
    newTokens.map((tokenAddress) => [tokenAddress, {}])
  );

  const decimals = new Map<string, number>(
    results.map((result, index) => [
      newTokens[index],
      result.success ? result.value ?? 0 : 0,
    ])
  );
  return decimals;
};

const fetchTokensTotalSupply = async (
  ctx: BlockContext,
  newTokens: string[]
) => {
  const multicall = new Multicall(ctx, MULTICALL_ADDRESS);

  const results = await multicall.tryAggregate(
    functions.totalSupply,
    newTokens.map((tokenAddress) => [tokenAddress, {}])
  );

  const totalSupplies = new Map<string, bigint>(
    results.map((result, index) => [
      newTokens[index],
      result.success ? result.value ?? 0n : 0n,
    ])
  );
  return totalSupplies;
};
