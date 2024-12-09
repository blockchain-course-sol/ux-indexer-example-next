"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inititliazeTokens = void 0;
const util_internal_1 = require("@subsquid/util-internal");
const multicall_1 = require("../../abi/multicall");
const model_1 = require("../../model");
const global_constant_1 = require("../constants/global.constant");
const usdc_1 = require("../../abi/usdc");
const inititliazeTokens = async (mctx, newTokens) => {
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
        const decimalsToken = (0, util_internal_1.assertNotNull)(decimals.get(tokenAddress));
        const totalSupply = (0, util_internal_1.assertNotNull)(totalSupplies.get(tokenAddress));
        const totalSupplyInTokens = BigInt(totalSupply) / BigInt(10 ** decimalsToken);
        newTokensEntities.push(new model_1.Token({
            id: tokenAddress,
            tokenAddress: tokenAddress,
            symbol: (0, util_internal_1.assertNotNull)(symbols.get(tokenAddress)),
            name: (0, util_internal_1.assertNotNull)(names.get(tokenAddress)),
            decimals: decimalsToken,
            totalSupply: totalSupplyInTokens,
            totalTransfers: 0,
            holders: 0,
        }));
    }
    await mctx.store.upsert(newTokensEntities);
};
exports.inititliazeTokens = inititliazeTokens;
const fetchTokensSymbol = async (ctx, newTokens) => {
    const multicall = new multicall_1.Multicall(ctx, global_constant_1.MULTICALL_ADDRESS);
    const results = await multicall.tryAggregate(usdc_1.functions.symbol, newTokens.map((tokenAddress) => [tokenAddress, {}]));
    const symbols = new Map(results.map((result, index) => [
        newTokens[index],
        result.success ? result.value ?? "" : "",
    ]));
    return symbols;
};
const fetchTokensName = async (ctx, newTokens) => {
    const multicall = new multicall_1.Multicall(ctx, global_constant_1.MULTICALL_ADDRESS);
    const results = await multicall.tryAggregate(usdc_1.functions.name, newTokens.map((tokenAddress) => [tokenAddress, {}]));
    const names = new Map(results.map((result, index) => [
        newTokens[index],
        result.success ? result.value ?? "" : "",
    ]));
    return names;
};
const fetchTokensDecimals = async (ctx, newTokens) => {
    const multicall = new multicall_1.Multicall(ctx, global_constant_1.MULTICALL_ADDRESS);
    const results = await multicall.tryAggregate(usdc_1.functions.decimals, newTokens.map((tokenAddress) => [tokenAddress, {}]));
    const decimals = new Map(results.map((result, index) => [
        newTokens[index],
        result.success ? result.value ?? 0 : 0,
    ]));
    return decimals;
};
const fetchTokensTotalSupply = async (ctx, newTokens) => {
    const multicall = new multicall_1.Multicall(ctx, global_constant_1.MULTICALL_ADDRESS);
    const results = await multicall.tryAggregate(usdc_1.functions.totalSupply, newTokens.map((tokenAddress) => [tokenAddress, {}]));
    const totalSupplies = new Map(results.map((result, index) => [
        newTokens[index],
        result.success ? result.value ?? 0n : 0n,
    ]));
    return totalSupplies;
};
