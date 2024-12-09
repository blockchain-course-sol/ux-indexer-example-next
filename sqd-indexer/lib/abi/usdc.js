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
exports.Contract = exports.functions = exports.events = void 0;
const p = __importStar(require("@subsquid/evm-codec"));
const evm_abi_1 = require("@subsquid/evm-abi");
exports.events = {
    Approval: (0, evm_abi_1.event)("0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925", "Approval(address,address,uint256)", { owner: (0, evm_abi_1.indexed)(p.address), spender: (0, evm_abi_1.indexed)(p.address), value: p.uint256 }),
    AuthorizationCanceled: (0, evm_abi_1.event)("0x1cdd46ff242716cdaa72d159d339a485b3438398348d68f09d7c8c0a59353d81", "AuthorizationCanceled(address,bytes32)", { authorizer: (0, evm_abi_1.indexed)(p.address), nonce: (0, evm_abi_1.indexed)(p.bytes32) }),
    AuthorizationUsed: (0, evm_abi_1.event)("0x98de503528ee59b575ef0c0a2576a82497bfc029a5685b209e9ec333479b10a5", "AuthorizationUsed(address,bytes32)", { authorizer: (0, evm_abi_1.indexed)(p.address), nonce: (0, evm_abi_1.indexed)(p.bytes32) }),
    Blacklisted: (0, evm_abi_1.event)("0xffa4e6181777692565cf28528fc88fd1516ea86b56da075235fa575af6a4b855", "Blacklisted(address)", { _account: (0, evm_abi_1.indexed)(p.address) }),
    BlacklisterChanged: (0, evm_abi_1.event)("0xc67398012c111ce95ecb7429b933096c977380ee6c421175a71a4a4c6c88c06e", "BlacklisterChanged(address)", { newBlacklister: (0, evm_abi_1.indexed)(p.address) }),
    Burn: (0, evm_abi_1.event)("0xcc16f5dbb4873280815c1ee09dbd06736cffcc184412cf7a71a0fdb75d397ca5", "Burn(address,uint256)", { burner: (0, evm_abi_1.indexed)(p.address), amount: p.uint256 }),
    MasterMinterChanged: (0, evm_abi_1.event)("0xdb66dfa9c6b8f5226fe9aac7e51897ae8ee94ac31dc70bb6c9900b2574b707e6", "MasterMinterChanged(address)", { newMasterMinter: (0, evm_abi_1.indexed)(p.address) }),
    Mint: (0, evm_abi_1.event)("0xab8530f87dc9b59234c4623bf917212bb2536d647574c8e7e5da92c2ede0c9f8", "Mint(address,address,uint256)", { minter: (0, evm_abi_1.indexed)(p.address), to: (0, evm_abi_1.indexed)(p.address), amount: p.uint256 }),
    MinterConfigured: (0, evm_abi_1.event)("0x46980fca912ef9bcdbd36877427b6b90e860769f604e89c0e67720cece530d20", "MinterConfigured(address,uint256)", { minter: (0, evm_abi_1.indexed)(p.address), minterAllowedAmount: p.uint256 }),
    MinterRemoved: (0, evm_abi_1.event)("0xe94479a9f7e1952cc78f2d6baab678adc1b772d936c6583def489e524cb66692", "MinterRemoved(address)", { oldMinter: (0, evm_abi_1.indexed)(p.address) }),
    OwnershipTransferred: (0, evm_abi_1.event)("0x8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e0", "OwnershipTransferred(address,address)", { previousOwner: p.address, newOwner: p.address }),
    Pause: (0, evm_abi_1.event)("0x6985a02210a168e66602d3235cb6db0e70f92b3ba4d376a33c0f3d9434bff625", "Pause()", {}),
    PauserChanged: (0, evm_abi_1.event)("0xb80482a293ca2e013eda8683c9bd7fc8347cfdaeea5ede58cba46df502c2a604", "PauserChanged(address)", { newAddress: (0, evm_abi_1.indexed)(p.address) }),
    RescuerChanged: (0, evm_abi_1.event)("0xe475e580d85111348e40d8ca33cfdd74c30fe1655c2d8537a13abc10065ffa5a", "RescuerChanged(address)", { newRescuer: (0, evm_abi_1.indexed)(p.address) }),
    Transfer: (0, evm_abi_1.event)("0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef", "Transfer(address,address,uint256)", { from: (0, evm_abi_1.indexed)(p.address), to: (0, evm_abi_1.indexed)(p.address), value: p.uint256 }),
    UnBlacklisted: (0, evm_abi_1.event)("0x117e3210bb9aa7d9baff172026820255c6f6c30ba8999d1c2fd88e2848137c4e", "UnBlacklisted(address)", { _account: (0, evm_abi_1.indexed)(p.address) }),
    Unpause: (0, evm_abi_1.event)("0x7805862f689e2f13df9f062ff482ad3ad112aca9e0847911ed832e158c525b33", "Unpause()", {}),
};
exports.functions = {
    CANCEL_AUTHORIZATION_TYPEHASH: (0, evm_abi_1.viewFun)("0xd9169487", "CANCEL_AUTHORIZATION_TYPEHASH()", {}, p.bytes32),
    DOMAIN_SEPARATOR: (0, evm_abi_1.viewFun)("0x3644e515", "DOMAIN_SEPARATOR()", {}, p.bytes32),
    PERMIT_TYPEHASH: (0, evm_abi_1.viewFun)("0x30adf81f", "PERMIT_TYPEHASH()", {}, p.bytes32),
    RECEIVE_WITH_AUTHORIZATION_TYPEHASH: (0, evm_abi_1.viewFun)("0x7f2eecc3", "RECEIVE_WITH_AUTHORIZATION_TYPEHASH()", {}, p.bytes32),
    TRANSFER_WITH_AUTHORIZATION_TYPEHASH: (0, evm_abi_1.viewFun)("0xa0cc6a68", "TRANSFER_WITH_AUTHORIZATION_TYPEHASH()", {}, p.bytes32),
    allowance: (0, evm_abi_1.viewFun)("0xdd62ed3e", "allowance(address,address)", { owner: p.address, spender: p.address }, p.uint256),
    approve: (0, evm_abi_1.fun)("0x095ea7b3", "approve(address,uint256)", { spender: p.address, value: p.uint256 }, p.bool),
    authorizationState: (0, evm_abi_1.viewFun)("0xe94a0102", "authorizationState(address,bytes32)", { authorizer: p.address, nonce: p.bytes32 }, p.bool),
    balanceOf: (0, evm_abi_1.viewFun)("0x70a08231", "balanceOf(address)", { account: p.address }, p.uint256),
    blacklist: (0, evm_abi_1.fun)("0xf9f92be4", "blacklist(address)", { _account: p.address }),
    blacklister: (0, evm_abi_1.viewFun)("0xbd102430", "blacklister()", {}, p.address),
    burn: (0, evm_abi_1.fun)("0x42966c68", "burn(uint256)", { _amount: p.uint256 }),
    cancelAuthorization: (0, evm_abi_1.fun)("0x5a049a70", "cancelAuthorization(address,bytes32,uint8,bytes32,bytes32)", {
        authorizer: p.address,
        nonce: p.bytes32,
        v: p.uint8,
        r: p.bytes32,
        s: p.bytes32,
    }),
    configureMinter: (0, evm_abi_1.fun)("0x4e44d956", "configureMinter(address,uint256)", { minter: p.address, minterAllowedAmount: p.uint256 }, p.bool),
    currency: (0, evm_abi_1.viewFun)("0xe5a6b10f", "currency()", {}, p.string),
    decimals: (0, evm_abi_1.viewFun)("0x313ce567", "decimals()", {}, p.uint8),
    decreaseAllowance: (0, evm_abi_1.fun)("0xa457c2d7", "decreaseAllowance(address,uint256)", { spender: p.address, decrement: p.uint256 }, p.bool),
    increaseAllowance: (0, evm_abi_1.fun)("0x39509351", "increaseAllowance(address,uint256)", { spender: p.address, increment: p.uint256 }, p.bool),
    initialize: (0, evm_abi_1.fun)("0x3357162b", "initialize(string,string,string,uint8,address,address,address,address)", {
        tokenName: p.string,
        tokenSymbol: p.string,
        tokenCurrency: p.string,
        tokenDecimals: p.uint8,
        newMasterMinter: p.address,
        newPauser: p.address,
        newBlacklister: p.address,
        newOwner: p.address,
    }),
    initializeV2: (0, evm_abi_1.fun)("0xd608ea64", "initializeV2(string)", {
        newName: p.string,
    }),
    initializeV2_1: (0, evm_abi_1.fun)("0x2fc81e09", "initializeV2_1(address)", {
        lostAndFound: p.address,
    }),
    isBlacklisted: (0, evm_abi_1.viewFun)("0xfe575a87", "isBlacklisted(address)", { _account: p.address }, p.bool),
    isMinter: (0, evm_abi_1.viewFun)("0xaa271e1a", "isMinter(address)", { account: p.address }, p.bool),
    masterMinter: (0, evm_abi_1.viewFun)("0x35d99f35", "masterMinter()", {}, p.address),
    mint: (0, evm_abi_1.fun)("0x40c10f19", "mint(address,uint256)", { _to: p.address, _amount: p.uint256 }, p.bool),
    minterAllowance: (0, evm_abi_1.viewFun)("0x8a6db9c3", "minterAllowance(address)", { minter: p.address }, p.uint256),
    name: (0, evm_abi_1.viewFun)("0x06fdde03", "name()", {}, p.string),
    nonces: (0, evm_abi_1.viewFun)("0x7ecebe00", "nonces(address)", { owner: p.address }, p.uint256),
    owner: (0, evm_abi_1.viewFun)("0x8da5cb5b", "owner()", {}, p.address),
    pause: (0, evm_abi_1.fun)("0x8456cb59", "pause()", {}),
    paused: (0, evm_abi_1.viewFun)("0x5c975abb", "paused()", {}, p.bool),
    pauser: (0, evm_abi_1.viewFun)("0x9fd0506d", "pauser()", {}, p.address),
    permit: (0, evm_abi_1.fun)("0xd505accf", "permit(address,address,uint256,uint256,uint8,bytes32,bytes32)", {
        owner: p.address,
        spender: p.address,
        value: p.uint256,
        deadline: p.uint256,
        v: p.uint8,
        r: p.bytes32,
        s: p.bytes32,
    }),
    receiveWithAuthorization: (0, evm_abi_1.fun)("0xef55bec6", "receiveWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)", {
        from: p.address,
        to: p.address,
        value: p.uint256,
        validAfter: p.uint256,
        validBefore: p.uint256,
        nonce: p.bytes32,
        v: p.uint8,
        r: p.bytes32,
        s: p.bytes32,
    }),
    removeMinter: (0, evm_abi_1.fun)("0x3092afd5", "removeMinter(address)", { minter: p.address }, p.bool),
    rescueERC20: (0, evm_abi_1.fun)("0xb2118a8d", "rescueERC20(address,address,uint256)", {
        tokenContract: p.address,
        to: p.address,
        amount: p.uint256,
    }),
    rescuer: (0, evm_abi_1.viewFun)("0x38a63183", "rescuer()", {}, p.address),
    symbol: (0, evm_abi_1.viewFun)("0x95d89b41", "symbol()", {}, p.string),
    totalSupply: (0, evm_abi_1.viewFun)("0x18160ddd", "totalSupply()", {}, p.uint256),
    transfer: (0, evm_abi_1.fun)("0xa9059cbb", "transfer(address,uint256)", { to: p.address, value: p.uint256 }, p.bool),
    transferFrom: (0, evm_abi_1.fun)("0x23b872dd", "transferFrom(address,address,uint256)", { from: p.address, to: p.address, value: p.uint256 }, p.bool),
    transferOwnership: (0, evm_abi_1.fun)("0xf2fde38b", "transferOwnership(address)", {
        newOwner: p.address,
    }),
    transferWithAuthorization: (0, evm_abi_1.fun)("0xe3ee160e", "transferWithAuthorization(address,address,uint256,uint256,uint256,bytes32,uint8,bytes32,bytes32)", {
        from: p.address,
        to: p.address,
        value: p.uint256,
        validAfter: p.uint256,
        validBefore: p.uint256,
        nonce: p.bytes32,
        v: p.uint8,
        r: p.bytes32,
        s: p.bytes32,
    }),
    unBlacklist: (0, evm_abi_1.fun)("0x1a895266", "unBlacklist(address)", {
        _account: p.address,
    }),
    unpause: (0, evm_abi_1.fun)("0x3f4ba83a", "unpause()", {}),
    updateBlacklister: (0, evm_abi_1.fun)("0xad38bf22", "updateBlacklister(address)", {
        _newBlacklister: p.address,
    }),
    updateMasterMinter: (0, evm_abi_1.fun)("0xaa20e1e4", "updateMasterMinter(address)", {
        _newMasterMinter: p.address,
    }),
    updatePauser: (0, evm_abi_1.fun)("0x554bab3c", "updatePauser(address)", {
        _newPauser: p.address,
    }),
    updateRescuer: (0, evm_abi_1.fun)("0x2ab60045", "updateRescuer(address)", {
        newRescuer: p.address,
    }),
    version: (0, evm_abi_1.viewFun)("0x54fd4d50", "version()", {}, p.string),
};
class Contract extends evm_abi_1.ContractBase {
    CANCEL_AUTHORIZATION_TYPEHASH() {
        return this.eth_call(exports.functions.CANCEL_AUTHORIZATION_TYPEHASH, {});
    }
    DOMAIN_SEPARATOR() {
        return this.eth_call(exports.functions.DOMAIN_SEPARATOR, {});
    }
    PERMIT_TYPEHASH() {
        return this.eth_call(exports.functions.PERMIT_TYPEHASH, {});
    }
    RECEIVE_WITH_AUTHORIZATION_TYPEHASH() {
        return this.eth_call(exports.functions.RECEIVE_WITH_AUTHORIZATION_TYPEHASH, {});
    }
    TRANSFER_WITH_AUTHORIZATION_TYPEHASH() {
        return this.eth_call(exports.functions.TRANSFER_WITH_AUTHORIZATION_TYPEHASH, {});
    }
    allowance(owner, spender) {
        return this.eth_call(exports.functions.allowance, { owner, spender });
    }
    authorizationState(authorizer, nonce) {
        return this.eth_call(exports.functions.authorizationState, { authorizer, nonce });
    }
    balanceOf(account) {
        return this.eth_call(exports.functions.balanceOf, { account });
    }
    blacklister() {
        return this.eth_call(exports.functions.blacklister, {});
    }
    currency() {
        return this.eth_call(exports.functions.currency, {});
    }
    decimals() {
        return this.eth_call(exports.functions.decimals, {});
    }
    isBlacklisted(_account) {
        return this.eth_call(exports.functions.isBlacklisted, { _account });
    }
    isMinter(account) {
        return this.eth_call(exports.functions.isMinter, { account });
    }
    masterMinter() {
        return this.eth_call(exports.functions.masterMinter, {});
    }
    minterAllowance(minter) {
        return this.eth_call(exports.functions.minterAllowance, { minter });
    }
    name() {
        return this.eth_call(exports.functions.name, {});
    }
    nonces(owner) {
        return this.eth_call(exports.functions.nonces, { owner });
    }
    owner() {
        return this.eth_call(exports.functions.owner, {});
    }
    paused() {
        return this.eth_call(exports.functions.paused, {});
    }
    pauser() {
        return this.eth_call(exports.functions.pauser, {});
    }
    rescuer() {
        return this.eth_call(exports.functions.rescuer, {});
    }
    symbol() {
        return this.eth_call(exports.functions.symbol, {});
    }
    totalSupply() {
        return this.eth_call(exports.functions.totalSupply, {});
    }
    version() {
        return this.eth_call(exports.functions.version, {});
    }
}
exports.Contract = Contract;
