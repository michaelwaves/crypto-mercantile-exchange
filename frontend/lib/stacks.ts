import { makeContractCall, broadcastTransaction, Cl, Pc, PostConditionMode } from '@stacks/transactions';
import { STACKS_DEVNET } from "@stacks/network";
import { optionNameGenerator, yearsToBlockHeight, yearsToDate } from '@/lib/utils';

const DEPLOYER_ADDRESS = "ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM"
const SENDER_KEY = "753b7cc01a1a2e86221266a154af739463fce51219d97e4f856cd7200c3bd2a601"
console.log("DEVNET: ", STACKS_DEVNET)
const network = STACKS_DEVNET;

const contractCall = async (functionArgs: any[], contractName: string, functionName: string) => {
    const options = {
        contractAddress: DEPLOYER_ADDRESS,
        contractName,
        functionName,
        functionArgs,
        network,
        senderKey: SENDER_KEY,
        postConditions: [],
    };

    const transaction = await makeContractCall(options)

    console.log(transaction)
    // broadcast to the network
    const response = await broadcastTransaction({ transaction, network });
    console.log(response.txid);
    console.log(response)
    return response
}

const createOption = async (
    ticker: string,
    type: "call" | "put",
    strikePrice: number,
    optionPrice: number,
    expiry: number, //expiry in years
    volatility: number
) => {

    const expiryDate = yearsToDate(expiry)
    const contractName = optionNameGenerator(expiryDate, ticker, type, strikePrice)

    const functionArgs = [
        Cl.stringAscii(contractName), // contract-name
        Cl.stringAscii(ticker),               // underlying-asset
        Cl.stringAscii(type),               // type
        Cl.uint(strikePrice),                          // strike-price
        Cl.uint(yearsToBlockHeight(expiry)),                      // expiry
        Cl.uint(optionPrice),                           // bid
        Cl.uint(optionPrice),                           // ask
        Cl.uint(volatility),                           // iv
    ]

    const res = await contractCall(functionArgs, "options", 'create-option')
    console.log(res)
    return contractName

};

const fundContract = async (amount: number) => {
    const functionArgs = [
        Cl.uint(amount)
    ]

    const res = await contractCall(functionArgs, "options", "fund-contract")
    console.log(res)
}

const deleteOption = async (contractName: string) => {
    const functionArgs = [
        Cl.stringAscii(contractName),
    ]
    const res = await contractCall(functionArgs, "options", "delete-option")
    console.log(res)
}


export { contractCall, createOption, deleteOption, fundContract }