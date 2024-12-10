import {sha256Hash} from "./util/crypto";

export const ASSET_ID = {
    TON:            sha256Hash('TON'),
    USDT:           sha256Hash('USDT'),
    PEPE:           sha256Hash('PEPE'),
    HYDRA:           sha256Hash('HYDRA'),
    ANON:           sha256Hash('ANON'),
    DUREV:           sha256Hash('DUREV'),
    GRAM:           sha256Hash('GRAM'),
    RAFF:           sha256Hash('RAFF'),
    TCAT:           sha256Hash('TCAT'),
    KINGY:           sha256Hash('KINGY'),
    FWT:           sha256Hash('FWT'),
    BOLGUR:           sha256Hash('BOLGUR'),
    TONNEL:           sha256Hash('TONNEL'),
    MEM:          sha256Hash('MEM'),
    time:           sha256Hash('time'),
};

export const COLLATERAL_SELECT_PRIORITY = new Map<bigint, number>([
        [ASSET_ID.USDT,             1],
        [ASSET_ID.TON,              2],
    ]
);
export const NO_PRIORITY_SELECTED = 999;

// assets banned from being swapped from
export const BANNED_ASSETS_FROM = [
    // ASSET_ID.tsTON,
];
// assets banned from being swapped to
export const BANNED_ASSETS_TO = [
    // ASSET_ID.tsTON,
];
export const LT_SCALE: bigint = 10_000n;
export const LB_SCALE: bigint = 10_000n;

//  lower bound of asset worth to swap
export const PRICE_ACCURACY: bigint = 1_000_000_000n;   // 10^9
export const MIN_WORTH_SWAP_LIMIT: bigint = 100n * PRICE_ACCURACY; // usd

// should cancel liquidation if amount is less than that number
export const LIQUIDATION_BALANCE_LIMITS = new Map<bigint, bigint>([
    [ASSET_ID.TON,              5_000_000_000n],
    [ASSET_ID.USDT,             1_000_000n],
    [ASSET_ID.PEPE,   1_000_000_000_000n],
    [ASSET_ID.HYDRA,   1_000_000n],
    [ASSET_ID.ANON,        100_000_000_000n],
    [ASSET_ID.DUREV,        100_000_000_000n],
    [ASSET_ID.GRAM,        100_000_000_000n],
    [ASSET_ID.RAFF,        10_000_000_000n],
    [ASSET_ID.TCAT,        100_000_000_000n],
    [ASSET_ID.KINGY,        10_000_000_000n],
    [ASSET_ID.FWT,        10_000_000_000n],
    [ASSET_ID.BOLGUR,        100_000_000_000n],
    [ASSET_ID.TONNEL,        1_000_000_000n],
    [ASSET_ID.MEM,        1_000_000_000n],

]);

// worth of 100$ - important constant for making decision about liquidation amount
export const LIQUIDATION_STRATEGIC_LIMIT = 10_000_000_000n;
