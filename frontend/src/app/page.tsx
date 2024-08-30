'use client';

import { useState, useCallback, useEffect } from 'react'
import LotteryPeriodInfo from "./components/lottery-period-info";
import LotteryTable from "./components/lottery-table";
import ConfirmComponent from "./components/confirm-component";
import { AllTickets } from './variables/tickets'
import { DataUser, SCTicket, TicketInfo } from './variables/type';
import { useAccount, useBalance } from 'wagmi';
import getPriceFeedETHUSD from './blockchain/data-feeds';
import getContract, { getRawTxObj } from './blockchain/main-smart-contract';
import { ToastContainer, toast } from 'react-toastify';
import Web3 from 'web3';

export default function Home() {
  const url = 'https://rpc.ankr.com/eth_sepolia'
  const contractAddr = "0x631cc2858D1A438C579e08391e51f835B714706f"
  const privateKey = process.env.PRIVATE_KEY
  const endpointScan = 'https://sepolia.etherscan.io/tx/'

  const web3 = new Web3(new Web3.providers.HttpProvider(url))

  const getPrice = async () => {
    const { answer, roundId } = await getPriceFeedETHUSD() as any
    setP(answer)
    //   const a = await window.ethereum.request({
    //     "method": "eth_accounts",
    //     "param": []
    //   })
    //   console.log(a);
  }
  const getPlayers = async () => {
    const listOfPlayer = await getContract().methods.getListOfPlayer().call()
  }
  useEffect(() => {
    getPrice()
    // getPlayers()
  }, [])

  const [p, setP] = useState(0)
  const oriTicket: TicketInfo[] = AllTickets
  const [tickets, setTickets] = useState<TicketInfo[]>(oriTicket)
  const [refresh, setRefresh] = useState<boolean>(false)
  const refreshTickets = () => {
    const tks = tickets.map((el) => {
      el.quantity = 0;
      el.totalValueETH = 0;
      el.totalValueUSD = 0
      return el
    })
    setTickets(tks)
  }

  // Confirm - send signed tx to smart contract
  const { address, isConnected } = useAccount()
  const result = useBalance({ address })

  /* #TODO:
    1. Create transaction object
      1.1. param "data" -> encode param of method (type function) of smart contract (hex type)
    2. Sign transaction obj
      2.1. Open browser wallet (Metamask) to sign tx
    3. Send signed transaction obj to smart contract on blockchain though node provider (who connects and interacts with blockchain) -> web3.eth.sendSignedTransaction(signedTx.rawTransaction)
  */


  const confirm = async (dataUser: DataUser) => {
    const { SCTickets, total_ETH } = dataUser
    // const account = web3.eth.accounts.privateKeyToAccount(privateKey)

    // const rawTx = await getRawTxObj(account.address, total_ETH, SCTickets)

    // const signedTx = await web3.eth.accounts.signTransaction(rawTx, account.privateKey);

    // const txReceipt = await 
    // web3.eth.sendSignedTransaction(signedTx.rawTransaction).then((res) => {
    //   toast.success('Buy tickets successfull! View your transction ')
    // }).catch((err) => {
    //   toast.error(err)
    // })

    // const promiseSendTx = web3.eth.sendSignedTransaction(signedTx.rawTransaction)
    const msg = `0x${Buffer.from('Purchase tickets', 'utf-8').toString('hex')}`
    const signTx = window.ethereum.request({
      "method": "personal_sign",
      "params": [
        {
          "challenge": msg,
          "address": address
        }
      ]
    })
    console.log('metamask sign', signTx);
    // console.log('private key sign', signedTx);


    toast.promise(
      signTx,
      {
        pending: "Buying ticket...",
        success: {
          render({ data }) {
            return <div className='flex gap-2 flex-col'>
              <p>Buy ticket successfully!</p>
              <a className="no-underline" href={endpointScan + data}>View your transaction ${endpointScan + data}</a>
            </div>
          }
        },
        error: {
          render({ data }) {
            return `${data}`
          }
        }
      }
    )
  }

  return (
    <div className="relative flex gap-6 min-h-screen flex-col items-center justify-start lg:px-48 px-20 pt-10 pb-16">
      <LotteryPeriodInfo />
      <LotteryTable homeTickets={tickets} priceFeedETHUSD={p} getSelectedTickets={(res: TicketInfo[]) => {
        setTickets([...res])
      }} />
      {
        tickets.some((el) => el.quantity) &&
        <ConfirmComponent
          tickets={tickets}
          setRefresh={(res: boolean) => {
            if (res) refreshTickets()
            setRefresh(false)
          }}
          onConfirm={confirm}
        ></ConfirmComponent>
      }
      <ToastContainer />
    </div>
  );
}
