import {Cell, fromNano, OpenedContract} from "@ton/ton";
import {MyDatabase} from "../../db/database";
import {isAxiosError} from "axios";
import {User} from "../../db/types";
import {bigIntMax, bigIntMin} from "../../util/math";
import {Evaa, getPrices, MASTER_CONSTANTS} from "coffin-sdk";
import {Messenger} from "../../lib/bot";

import {ASSET_ID, LB_SCALE, LIQUIDATION_STRATEGIC_LIMIT, makeTonClient, POOL_CONFIG, PRICE_API,} from "../../config";
import {retry} from "../../util/retry";
import {PriceData} from "./types";
import {addLiquidationReserve, selectLiquidationAssets} from "./helpers";
import {Address} from "@ton/core";

export async function addLiquidationTask(
    db: MyDatabase, user: User,
    loanAssetId: bigint, collateralAssetId: bigint,
    liquidationAmount: bigint, minCollateralAmount: bigint,
    pricesCell: Cell) {
    const queryID = BigInt(Date.now());
    await db.addTask(
        user.wallet_address, user.contract_address, Date.now(),
        loanAssetId, collateralAssetId,
        liquidationAmount, minCollateralAmount,
        pricesCell.toBoc().toString('base64'),
        queryID);
}

async function checkIsAllowed(contract_address: string) {
    const tonClient = await makeTonClient();
    const res = await tonClient.runMethodWithError(Address.parse(contract_address), 'getAllUserScData')
    res.stack.skip(6)
    return res.stack.pop()
}

export async function validateBalances(db: MyDatabase, evaa: OpenedContract<Evaa>, bot: Messenger) {
    try {
        // console.log(`Start validating balances at ${new Date().toLocaleString()}`)
        const users = await db.getUsers();

        // fetch prices
        const pricesRes = await retry<PriceData>(
            async () => await getPrices([PRICE_API]),
            {attempts: 10, attemptInterval: 1000}
        );
        if (!pricesRes.ok) throw (`Failed to fetch prices`);
        const {dict: pricesDict, dataCell} = pricesRes.value;

        // sync evaa (required to update rates mostly)
        const evaaSyncRes = await retry(
            async () => await evaa.getSync(),
            {attempts: 10, attemptInterval: 1000}
        );
        if (!evaaSyncRes.ok) throw (`Failed to sync evaa`);

        const assetsDataDict = evaa.data.assetsData;
        const assetConfigDict = evaa.data.assetsConfig;
        // const masterConstants = evaa.data.masterConfig.

        for (const user of users) {
            if (await db.isTaskExists(user.wallet_address)) {
                console.log(`Task for ${user.wallet_address} already exists. Skipping...`);
                continue;
            }

            const {
                collateralValue, collateralId,
                loanValue, loanId,
                totalDebt, totalLimit,
            } = selectLiquidationAssets(user.principals, pricesDict, assetConfigDict, assetsDataDict);
            if (totalDebt > 0n){
               if (totalDebt * 10000n / totalLimit > 8000n && totalDebt * 10000n / totalLimit < 11000n) {
                   console.log(`User ${user.wallet_address} selected: collateral ${POOL_CONFIG.poolAssetsConfig.find((asset) => {
                           return asset.assetId === collateralId
                       }
                   ).name}, loan ${POOL_CONFIG.poolAssetsConfig.find((asset) => {
                           return asset.assetId === loanId
                       }
                   ).name} with debt ${fromNano(totalDebt)} and limit ${fromNano(totalLimit)}`);
               }
            }
            if (totalLimit < totalDebt) {
                if (collateralId === 0n) {
                    const message = `[Validator]: Problem with user ${user.wallet_address}: collateral not selected, user was blacklisted`;
                    console.warn(message);
                    await db.blacklistUser(user.wallet_address);
                    bot.sendMessage(message);
                    continue;
                }

                const collateralConfig = assetConfigDict.get(collateralId);
                const loanConfig = assetConfigDict.get(loanId);
                const liquidationBonus = collateralConfig.liquidationBonus;
                const collateralScale = 10n ** collateralConfig.decimals;
                const loanScale = 10n ** loanConfig.decimals;
                const loanPrice: bigint = pricesDict.get(loanId);
                const collateralPrice: bigint = pricesDict.get(collateralId);

                let liquidationAmount = bigIntMin(
                    bigIntMax(
                        collateralValue / 4n, bigIntMin(collateralValue, LIQUIDATION_STRATEGIC_LIMIT)
                    ) * loanScale * LB_SCALE / liquidationBonus / loanPrice,

                    loanValue * loanScale / loanPrice
                );

                const liquidationReserveFactor = loanConfig.liquidationReserveFactor;
                const reserveFactorScale = MASTER_CONSTANTS.ASSET_LIQUIDATION_RESERVE_FACTOR_SCALE;

                let minCollateralAmount = liquidationAmount * loanPrice *
                    liquidationBonus / LB_SCALE *
                    collateralScale / collateralPrice / loanScale;

                // TODO: add dust value to liquidationAmount to prevent dusts in principals
                liquidationAmount = addLiquidationReserve(liquidationAmount, reserveFactorScale, liquidationReserveFactor);
                minCollateralAmount = minCollateralAmount * 99n / 100n;

                if (minCollateralAmount >= pricesDict.get(ASSET_ID.TON) * collateralScale / collateralPrice) {
                    try {
                        const isAllowed = await checkIsAllowed(user.contract_address);
                        if (isAllowed && isAllowed.type === 'cell') {
                            if (isAllowed.cell.beginParse().loadBoolean()){
                                console.log(`User ${user.contract_address} is allowed to go over the limit.`);
                                continue;
                            } else {
                                console.log(`User ${user.contract_address} is not allowed to go over the limit.`);
                            }
                        }
                    } catch (e){
                        console.log(e)
                    }
                    await addLiquidationTask(db, user, loanId, collateralId, liquidationAmount, minCollateralAmount, dataCell);
                    await bot.sendMessage(`Task for ${user.wallet_address} added`);
                    console.log(`Task for ${user.wallet_address} added`);
                } else {
                    // console.log(`Not enough collateral for ${user.wallet_address}`);
                }
            }
        }

        // console.log(`Finish validating balances at ${new Date().toLocaleString()}`)
    } catch (e) {
        if (!isAxiosError(e)) {
            console.log(e)
            throw (`Not axios error: ${JSON.stringify(e)}}`);
        }

        if (e.response) {
            console.log(`Error: ${e.response.status} - ${e.response.statusText}`);
        } else if (e.request) {
            console.log(`Error: No response from server.

${e.request}`);
        } else {
            console.log(`Error: unknown`);
        }
        console.log(e)
        console.log(`Error while validating balances...`)
    }
}
