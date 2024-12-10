"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.processFinalHolderCount = exports.getTokensToUpdate = exports.initializeTokens = exports.processBalanceUpdate = exports.getOrCreateBalance = exports.calculateValueBD = void 0;
const model_1 = require("../../model");
const token_1 = require("../entities/token");
const calculateValueBD = (value, decimals, ctx) => {
    try {
        if (value === null || value === undefined) {
            ctx.log.warn("Received null or undefined value for valueBD calculation");
            return 0;
        }
        const isNegative = value < 0n;
        const absoluteValue = isNegative ? -value : value;
        const valueString = absoluteValue.toString();
        if (valueString.length > 30) {
            ctx.log.warn(`Value ${valueString} is too large for safe float conversion`);
            return 0;
        }
        const rawBD = Number(absoluteValue) / Math.pow(10, decimals);
        if (!Number.isFinite(rawBD)) {
            ctx.log.warn(`Invalid conversion result for value: ${valueString}, decimals: ${decimals}`);
            return 0;
        }
        return isNegative ? -rawBD : rawBD;
    }
    catch (error) {
        ctx.log.error(`Error calculating valueBD: ${error}, value: ${value}, decimals: ${decimals}`);
        return 0;
    }
};
exports.calculateValueBD = calculateValueBD;
const getOrCreateBalance = (wallet, tokenAddress, blockHeight, balances) => {
    const id = `${wallet}-${tokenAddress}`;
    let balance = balances.get(id);
    if (!balance) {
        balance = new model_1.Balance({
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
exports.getOrCreateBalance = getOrCreateBalance;
const processBalanceUpdate = (balance, value, isAddition, blockHeight, tokenDecimals, ctx) => {
    balance.value = isAddition ? balance.value + value : balance.value - value;
    balance.valueBD = (0, exports.calculateValueBD)(balance.value, tokenDecimals, ctx);
    balance.lastUpdateblock = blockHeight;
};
exports.processBalanceUpdate = processBalanceUpdate;
const initializeTokens = async (isTokensInitialized, trackedTokens, decimals, ctx) => {
    if (!isTokensInitialized) {
        await (0, token_1.inititliazeTokens)(ctx, trackedTokens);
        for (const tokenAddress of trackedTokens) {
            const token = await ctx.store.get(model_1.Token, tokenAddress);
            if (!token) {
                ctx.log.error(`Failed loading token at address: ${tokenAddress}`);
                return;
            }
            decimals.set(tokenAddress, token.decimals);
        }
        isTokensInitialized = true;
    }
};
exports.initializeTokens = initializeTokens;
const getTokensToUpdate = async (tokenStats, ctx) => {
    return await Promise.all([...tokenStats.entries()].map(async ([tokenAddress, stats]) => {
        const token = await ctx.store.get(model_1.Token, tokenAddress);
        if (!token)
            return null;
        token.totalTransfers += stats.transferCount;
        token.holders += stats.finalHolderCount - stats.initialHolderCount;
        return token;
    })).then((tokens) => tokens.filter((t) => t !== null));
};
exports.getTokensToUpdate = getTokensToUpdate;
const processFinalHolderCount = (balances, tokenStats) => {
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
exports.processFinalHolderCount = processFinalHolderCount;
