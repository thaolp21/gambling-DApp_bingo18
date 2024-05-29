'use client';

import { Button } from "@headlessui/react";
import { CATEGORY, SM_GLE_VALUE, SM_OPTIONS, UNIT } from "../variables/info";
import { DataUser, SCTicket, SCTicketValue, TicketInfo } from "../variables/type";
import { useAccount, useBalance } from "wagmi";
import { useState } from "react";
import { useConnectModal } from "@rainbow-me/rainbowkit";

export default function ConfirmComponent(
    {
        tickets,
        setRefresh,
        onConfirm
    }: {
        tickets: TicketInfo[],
        setRefresh: any,
        onConfirm: any
    }
) {
    const calcTotalPrice = (list: TicketInfo[], unit: UNIT) => {
        const key = unit === UNIT.USD ? 'totalValueUSD' : 'totalValueETH'
        return list.reduce((total, el) => (total += (el[key] || 0)), 0)
    }
    const { address, isConnected } = useAccount()
    const [openNotiDialog, setOpenCWDialog] = useState<boolean>(false)
    const { openConnectModal } = useConnectModal();
    const { data } = useBalance({ address })
    const dataUser: DataUser = {
        address: address!,
        tikets: tickets,
        total_ETH: calcTotalPrice(tickets, UNIT.ETH),
        total_USD: calcTotalPrice(tickets, UNIT.USD)
    }
    const checkInsufBl = () => {
        const balanceWl = Number(data?.value) / (Math.pow(10, data?.decimals!))
        return (balanceWl < dataUser.total_ETH)
    }
    const confirm = () => {
        if (isConnected && !checkInsufBl()) {
            dataUser.tikets = dataUser.tikets.filter(el => el.quantity)
            dataUser.SCTickets = convertSCTickets(dataUser.tikets)
            console.log(dataUser);
            onConfirm(true)
        }
    }
    const addValueOptSCTks = (optCode: SM_OPTIONS, val: SCTicketValue, arrs: SCTicket[]) => {
        const scTk = arrs.find(el => el.option === optCode)
        if (scTk) {
            scTk.values.push(val)
        } else {
            arrs.push({ option: optCode, values: [val] })
        }
        return arrs
    }

    const convertSCTickets = (data: TicketInfo[]) => {
        return data.reduce((res: SCTicket[], d) => {
            const codes = d.code?.split('_') || []
            const amount = d.quantity || 0
            let optCode = SM_OPTIONS.SUM
            let value: any = +codes[codes.length - 1]

            if (codes[0] == CATEGORY.SUM) {
                if (isNaN(value)) {
                    optCode = SM_OPTIONS.GLE
                    const key = codes[1] as unknown as number
                    value = SM_GLE_VALUE[key]
                }
            } else {
                switch (codes[1]) {
                    case '1':
                        optCode = SM_OPTIONS.ONEDUP
                        break;
                    case '2':
                        optCode = SM_OPTIONS.TWODUP
                        break;
                    default:
                        optCode = SM_OPTIONS.THREEDUP
                        break
                }
            }
            res = addValueOptSCTks(optCode, { value, amount }, res)
            return res
        }, [])
    }
    const renderConfirmBtn = () => {
        const btnConn = <Button onClick={openConnectModal} className="flex gap-3 justify-center hover:bg-white hover:text-black hover:rounded-lg  transition-all w-full px-2 py-1 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3" />
            </svg>
            <span>Connect</span>
        </Button>
        const btnInsufBl = <Button className="flex gap-3 justify-center hover:bg-white hover:text-black hover:rounded-lg  transition-all w-full px-2 py-1 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0 0 12.016 15a4.486 4.486 0 0 0-3.198 1.318M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z" />
            </svg>
            <span>Insufficient Balance</span>
        </Button>
        const btnConf = <Button onClick={confirm} className="flex gap-3 justify-center hover:bg-white hover:text-black hover:rounded-lg  transition-all w-full px-2 py-1 ">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
            </svg>
            <span>Confirm</span>
        </Button>
        return !isConnected ? btnConn : checkInsufBl() ? btnInsufBl : btnConf
    }
    return (
        <>
            <div className="fixed bottom-0 right-0  w-full bg-orange-500 text-white p-2 z-50">
                <div className="flex gap-2 justify-between">
                    <div className="w-6/12 flex gap-3 justify-evenly items-center">
                        <Button className="flex gap-3 justify-center hover:bg-white hover:text-black hover:rounded-lg transition-all w-full px-2 py-1 " onClick={() => setRefresh(true)}>

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                            </svg>
                            <span>Refresh</span>
                        </Button>
                        <span>|</span>
                        {renderConfirmBtn()}
                        <span>|</span>
                    </div>
                    <div className="w-5/12 flex flex-col gap-1 justify-center items-end">
                        <div className='flex gap-4 font-bold'>
                            <span>Total: </span>
                            <div >
                                <span>$ {dataUser.total_USD} USD</span>
                                <span> - ⟠ {dataUser.total_ETH.toFixed(4)} ETH</span>
                            </div>
                        </div>
                        {!isConnected && <p className="text-xs italic">Connect wallet to start buying tickets</p>}
                        {isConnected && checkInsufBl() && <p className="text-xs italic">Fund more ETH to your wallet to start buying tickets</p>}
                    </div>
                </div>
            </div >
        </>

    )
}