"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const evm_processor_1 = require("@subsquid/evm-processor");
const typeorm_store_1 = require("@subsquid/typeorm-store");
const usdcAbi = __importStar(require("./abi/usdc"));
const model_1 = require("./model");
const global_constant_1 = require("./utils/constants/global.constant");
const token_1 = require("./utils/entities/token");
const typeorm_1 = require("typeorm");
const global_helper_1 = require("./utils/helpers/global.helper");
const processor = new evm_processor_1.EvmBatchProcessor()
    .setGateway(global_constant_1.GATEWAY_SQD_URL)
    .setRpcEndpoint(global_constant_1.RPC_URL)
    .setFinalityConfirmation(75)
    .addLog({
    range: { from: global_constant_1.firstBlock },
    address: global_constant_1.trackedTokens,
    topic0: [usdcAbi.events.Transfer.topic],
})
    .setFields({
    log: {
        transactionHash: true,
    },
});
const db = new typeorm_store_1.TypeormDatabase({ supportHotBlocks: true });
let isTokensInitialized = false;
const decimals = new Map();
processor.run(db, async (ctx) => {
    if (!isTokensInitialized) {
        await (0, token_1.inititliazeTokens)(ctx, global_constant_1.trackedTokens);
        for (const tokenAddress of global_constant_1.trackedTokens) {
            const token = await ctx.store.get(model_1.Token, tokenAddress);
            if (!token) {
                ctx.log.error(`Failed loading token at address: ${tokenAddress}`);
                return;
            }
            decimals.set(tokenAddress, token.decimals);
        }
        isTokensInitialized = true;
    }
    const addresses = new Set();
    const tokenStats = new Map();
    for (const tokenAddress of global_constant_1.trackedTokens) {
        tokenStats.set(tokenAddress, {
            transferCount: 0,
            initialHolderCount: 0,
            finalHolderCount: 0,
        });
    }
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
            if (global_constant_1.trackedTokens.includes(log.address)) {
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
    const existingBalances = await ctx.store.findBy(model_1.Balance, {
        id: (0, typeorm_1.In)([...addresses]),
    });
    const balances = new Map();
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
            if (global_constant_1.trackedTokens.includes(log.address)) {
                const { from, to, value } = usdcAbi.events.Transfer.decode(log);
                const valueBigInt = BigInt(value.toString());
                const tokenDecimals = decimals.get(log.address);
                const fromBalance = (0, global_helper_1.getOrCreateBalance)(from, log.address, block.header.height, balances);
                const toBalance = (0, global_helper_1.getOrCreateBalance)(to, log.address, block.header.height, balances);
                (0, global_helper_1.processBalanceUpdate)(fromBalance, valueBigInt, false, block.header.height, tokenDecimals, ctx);
                (0, global_helper_1.processBalanceUpdate)(toBalance, valueBigInt, true, block.header.height, tokenDecimals, ctx);
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
    (0, global_helper_1.processFinalHolderCount)(balances, tokenStats);
    const tokensToUpdate = await (0, global_helper_1.getTokensToUpdate)(tokenStats, ctx);
    await ctx.store.save(tokensToUpdate);
    await ctx.store.save([...balances.values()]);
});
