'use client';

import { useState, createContext, useCallback } from 'react'
import LotteryPeriodInfo from "./components/lottery-period-info";
import LastResult from "./components/last-results";
import LotteryTable from "./components/lottery-table";
import ConfirmComponent from "./components/confirm-component";
import { AllTickets, SumTickets } from './variables/tickets'
import { TicketInfo } from './variables/type';
import { useAccount, useBalance } from 'wagmi';
import getPriceFeedETHUSD from './blockchain/data-feeds';
import { ETH_USD_RATE, PRICE_USD, } from './variables/info';

export default function Home() {
  const getPrice = useCallback(async () => {
    const price = await getPriceFeedETHUSD()
    console.log(price);
  }, [])
  const [p, setP] = useState(getPrice())
  console.log(p);


  // await getPriceFeedETHUSD().then((res) => pfETH_USD = res.round)
  // console.log('page', pfETH_USD);

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
  const { address, isConnected } = useAccount()
  const result = useBalance({ address })
  const confirm = (r: boolean) => {
    console.log(r);
  }



  return (
    <div className="relative flex gap-6 min-h-screen flex-col items-center justify-start lg:px-48 px-20 pt-10 pb-16">
      <LotteryPeriodInfo />
      <LotteryTable homeTickets={tickets} getSelectedTickets={(res: TicketInfo[]) => {
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

    </div>

  );
}
