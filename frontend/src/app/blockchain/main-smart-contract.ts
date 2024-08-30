import Web3 from "web3";
import { SCTicket } from "../variables/type";

const url = 'https://rpc.ankr.com/eth_sepolia'
const contractAddr = "0x631cc2858D1A438C579e08391e51f835B714706f"
const privateKey = process.env.PRIVATE_KEY!

const web3 = new Web3(new Web3.providers.HttpProvider(url))

const bingo18InterfaceABI = [
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "enum Bingo18.Option",
                        "name": "option",
                        "type": "uint8"
                    },
                    {
                        "components": [
                            {
                                "internalType": "uint32",
                                "name": "value",
                                "type": "uint32"
                            },
                            {
                                "internalType": "uint16",
                                "name": "amount",
                                "type": "uint16"
                            }
                        ],
                        "internalType": "struct Bingo18.Value[]",
                        "name": "values",
                        "type": "tuple[]"
                    }
                ],
                "internalType": "struct Bingo18.Ticket[]",
                "name": "options",
                "type": "tuple[]"
            }
        ],
        "name": "enterBingo",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getBingoState",
        "outputs": [
            {
                "internalType": "enum Bingo18.BingoState",
                "name": "",
                "type": "uint8"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getListOfPlayer",
        "outputs": [
            {
                "internalType": "address payable[]",
                "name": "",
                "type": "address[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
]

export default function getContract() {

    return new web3.eth.Contract(bingo18InterfaceABI, contractAddr)
}
const account = web3.eth.accounts.privateKeyToAccount(privateKey)

export async function getRawTxObj(address: string, valETH: number, args?: any[]) {
    const convertArgs = getContract().methods.enterBingo(args).arguments

    const data = web3.eth.abi.encodeFunctionCall(
        {
            "inputs": [
                {
                    "components": [
                        {
                            "internalType": "enum Bingo18.Option",
                            "name": "option",
                            "type": "uint8"
                        },
                        {
                            "components": [
                                {
                                    "internalType": "uint32",
                                    "name": "value",
                                    "type": "uint32"
                                },
                                {
                                    "internalType": "uint16",
                                    "name": "amount",
                                    "type": "uint16"
                                }
                            ],
                            "internalType": "struct Bingo18.Value[]",
                            "name": "values",
                            "type": "tuple[]"
                        }
                    ],
                    "internalType": "struct Bingo18.Ticket[]",
                    "name": "options",
                    "type": "tuple[]"
                }
            ],
            "name": "enterBingo",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        }
        , convertArgs);
    console.log(data);

    return {
        from: address,
        to: contractAddr,
        value: web3.utils.toWei(valETH, 'ether'),
        maxFeePerGas: 1000000108,
        maxPriorityFeePerGas: 100000,
        gasLimit: 2000000,
        nonce: await web3.eth.getTransactionCount(account.address),
        data: data
    }
}


