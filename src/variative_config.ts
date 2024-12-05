import {Address} from "@ton/core";
import {ASSET_ID} from "./steady_config";
import {beginCell, TonClient} from "@ton/ton";
import {configDotenv} from "dotenv";
import {JETTON_MASTER_ADDRESSES, MAINNET_ASSETS_ID} from "coffin-sdk";
import {NULL_ADDRESS} from "./constants";
import {CHAIN} from "@tonconnect/sdk";
import {JETTON_WALLETS_CODE} from "coffin-sdk/dist/constants";

// todo: set your own highload address
export const HIGHLOAD_ADDRESS = Address.parse('UQCwdtmM-gP1xepzfAAXY4tJrieF1ct_MvmM1qMtjD-yw_SS');
// set your own jetton wallets for specified highloadAddress
export const JETTON_WALLETS = new Map<bigint, Address>([
    [ASSET_ID.USDT, Address.parse('EQCoJleZsXR0Y-ZYTYxt3tDi63lKNjIYF8he3c1WOye6DF-3')],
    // Coffin-wallets
    [ASSET_ID.PEPE, Address.parse('EQAdbbDYwCcS22lQ3L_MY0GPyq59ssdRFfMzcq-RkxtWW_D9')],
    [ASSET_ID.ANON, Address.parse('EQAWvx_X-8I8gnO4fndQk2q7pn62Yowcd_Qbod5YO4Wq22rp')],
    [ASSET_ID.HYDRA, Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],
    [ASSET_ID.KINGY,  Address.parse('EQCoj_pjCsc_PvtXZL9FA2I4NTMOjP2qvK8nkz7h_Uyh-cw0')],
    [ASSET_ID.BOLGUR,  Address.parse('EQDQ-iuaORNUmt2EWRzk52mECnwfYcWOlZmUUM-ThvF6_Leu')],


    [ASSET_ID.TONNEL,  Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],
    [ASSET_ID.RAFF, Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],
    [ASSET_ID.DUREV,  Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],
    [ASSET_ID.GRAM,  Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],
    [ASSET_ID.TCAT,  Address.parse('EQBwd0jBxbhz966zw3mI4_LRByEt3yIR2spHDbqBRn-a9VBW')],

]);

export const IS_TESTNET = false;
const dbPathMainnet = './database-mainnet.db';
const dbPathTestnet = './database-testnet.db';
export const DB_PATH = IS_TESTNET ? dbPathTestnet : dbPathMainnet
/* Actual configuration */
export const TON_API_ENDPOINT = 'https://tonapi.io/';
export const PRICE_API = 'https://api.tonnel.network/coffin/getPricesMainnet'

export async function makeTonClient() {
    configDotenv();
    const tonClient = new TonClient({
        endpoint: 'https://toncenter.com/api/v2/jsonRPC',
        apiKey: process.env.TONCENTER_API_KEY,
    });
    return tonClient;
}

export const USER_UPDATE_DELAY = 60_000; // 60 seconds
export const TX_PROCESS_DELAY = 100; // ms
export const RPC_CALL_DELAY = 100; // ms

// export const POOL_CONFIG = MAINNET_LP_POOL_CONFIG; // for main pool v5
export const POOL_CONFIG = {
    poolAssetsConfig: [
        {
            name: 'TON',
            assetId: MAINNET_ASSETS_ID.TON,
            jettonMasterAddress: NULL_ADDRESS,
            jettonWalletCode: beginCell().endCell()
        },
        {
            name: 'USDT',
            assetId: MAINNET_ASSETS_ID.USDT,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.USDT[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.USDT[CHAIN.MAINNET]
        },
        {
            name: 'PEPE',
            assetId: MAINNET_ASSETS_ID.PEPE,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.PEPE[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.PEPE[CHAIN.MAINNET]
        },
        {
            name: 'ANON',
            assetId: MAINNET_ASSETS_ID.ANON,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.ANON[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.ANON[CHAIN.MAINNET]
        },
        {
            name: 'HYDRA',
            assetId: MAINNET_ASSETS_ID.HYDRA,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.HYDRA[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.HYDRA[CHAIN.MAINNET]
        },
        {
            name: 'RAFF',
            assetId: MAINNET_ASSETS_ID.RAFF,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.RAFF[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.RAFF[CHAIN.MAINNET]
        },
        {
            name: 'DUREV',
            assetId: MAINNET_ASSETS_ID.DUREV,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.DUREV[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.DUREV[CHAIN.MAINNET]
        },
        {
            name: 'GRAM',
            assetId: MAINNET_ASSETS_ID.GRAM,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.GRAM[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.GRAM[CHAIN.MAINNET]
        },
        {
            name: 'TCAT',
            assetId: MAINNET_ASSETS_ID.TCAT,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.TCAT[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.TCAT[CHAIN.MAINNET]
        },
        {
            name: 'KINGY',
            assetId: MAINNET_ASSETS_ID.KINGY,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.KINGY[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.KINGY[CHAIN.MAINNET]
        },
        {
            name: 'TONNEL',
            assetId: MAINNET_ASSETS_ID.TONNEL,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.TONNEL[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.TONNEL[CHAIN.MAINNET]
        },
        {
            name: 'BOLGUR',
            assetId: MAINNET_ASSETS_ID.BOLGUR,
            jettonMasterAddress: JETTON_MASTER_ADDRESSES.BOLGUR[CHAIN.MAINNET],
            jettonWalletCode: JETTON_WALLETS_CODE.BOLGUR[CHAIN.MAINNET]
        }
    ],
    masterAddress: Address.parse('EQBozwKVDya9IL3Kw4mR5AQph4yo15EuMdyX8nLljeaUxrpM'),
    masterConstants: {

    },
};
