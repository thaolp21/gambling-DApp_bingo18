import { useReadContract, http, createConfig } from "wagmi";
import Web3 from "web3";

export default async function getPriceFeedETHUSD() {
    /**
     * THIS IS EXAMPLE CODE THAT USES HARDCODED VALUES FOR CLARITY.
     * THIS IS EXAMPLE CODE THAT USES UN-AUDITED CODE.
     * DO NOT USE THIS CODE IN PRODUCTION.
     */

    const url = 'https://rpc.ankr.com/eth_sepolia'
    const addr = "0x694AA1769357215DE4FAC081bf1f309aDC325306"

    const web3 = new Web3(new Web3.providers.HttpProvider(url))
    const aggregatorV3InterfaceABI = [
        {
            inputs: [],
            name: "decimals",
            outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "description",
            outputs: [{ internalType: "string", name: "", type: "string" }],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [{ internalType: "uint80", name: "_roundId", type: "uint80" }],
            name: "getRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "latestRoundData",
            outputs: [
                { internalType: "uint80", name: "roundId", type: "uint80" },
                { internalType: "int256", name: "answer", type: "int256" },
                { internalType: "uint256", name: "startedAt", type: "uint256" },
                { internalType: "uint256", name: "updatedAt", type: "uint256" },
                { internalType: "uint80", name: "answeredInRound", type: "uint80" },
            ],
            stateMutability: "view",
            type: "function",
        },
        {
            inputs: [],
            name: "version",
            outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
            stateMutability: "view",
            type: "function",
        },
    ]
    const priceFeed = new web3.eth.Contract(aggregatorV3InterfaceABI, addr)
    let latestPrice = await priceFeed.methods
        .latestRoundData()
        .call()

    return latestPrice
}