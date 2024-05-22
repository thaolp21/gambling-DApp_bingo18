'use client';

import { Button, Dialog, DialogPanel, DialogTitle, Input, Transition, TransitionChild } from '@headlessui/react';
import { useState } from 'react';
import { ETH_USD_RATE, MINUS_PLUS, PRICE_USD, TICKET_CODE } from '../variables/info';
import Image from 'next/image';
import { TicketInfo } from '../variables/type';

export default function CartModal({
    openDialog,
    setOpenDialog,
    ticketInfo,
    selectedTickets,
}: {
    openDialog: boolean,
    setOpenDialog: any,
    ticketInfo: TicketInfo,
    selectedTickets: any,
}) {
    const options = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
    const [ticket, setTicket] = useState({ ...ticketInfo })
    const calculateTotal = (ticket: TicketInfo, qtt: number) => {
        return {
            ...ticket,
            quantity: qtt,
            totalValueUSD: qtt * PRICE_USD,
            totalValueETH: (qtt * PRICE_USD) / ETH_USD_RATE
        }
    }
    const setQuantity = (action: MINUS_PLUS, quantity: number = 0) => {
        switch (action) {
            case MINUS_PLUS.MINUS:
                setTicket((preObj) => {
                    const qt = preObj.quantity || 0
                    const num: number = qt > 0 ? (qt - 1) : 0
                    return calculateTotal(preObj, num)
                })
                break;
            case MINUS_PLUS.PLUS:
                if (ticket.quantity! < 100) {
                    setTicket((preObj) => (calculateTotal(preObj, (preObj.quantity || 0) + 1)))
                }
                break;
            default:
                setTicket((preObj) => (calculateTotal(preObj, quantity)))
                break;
        }
    }

    return (
        <Dialog open={openDialog} onClose={() => {
            setOpenDialog(false);
        }} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-4 bg-white p-10 w-4/6 rounded-xl">
                    <DialogTitle className="font-bold text-xl text-center">Bingo18</DialogTitle>
                    <div className='ticket-info flex flex-col justify-center items-center'>
                        <h5 className='font-bold text-2xl w-full text-center text-orange-500 mb-2'>{ticket?.category}</h5>
                        <div className='flex justify-evenly w-full text-lg'>
                            <p >{ticket?.des ? ticket?.title : ticket?.category}</p>
                            <strong className='bg-gradient-to-r from-orange-100 via-orange-500 to-orange-100 w-2/6 text-center rounded-lg '>{ticket?.des ? ticket?.des : ticket.title}</strong>
                            <p>{ticket?.prizeValue}</p>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <p className='italic text-sm p-1'>
                            Select quantity
                        </p>
                        <div className='ticket-selection rounded-2xl p-2 border-orange-500 border flex justify-evenly text-orange-500'>
                            <Button onClick={() => setQuantity(MINUS_PLUS.MINUS)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </Button>
                            <strong className='text-black'>
                                {ticket.quantity}
                            </strong>
                            <Button onClick={() => setQuantity(MINUS_PLUS.PLUS)}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                            </Button>
                        </div>
                    </div>

                    <div className='flex gap-2 justify-evenly'>
                        {options.map((e, i) => {
                            return (
                                <Button key={i} className='border rounded-full w-7 h-7 leading-7 text-sm text-center flex items-center justify-center border-orange-500' onClick={() => setQuantity(MINUS_PLUS.OPTION, e)}>
                                    <span className='text-orange-500 font-bold'>{e}</span>
                                </Button>
                            )
                        })}

                    </div>
                    <div className='flex flex-col gap-1'>
                        <div className='flex gap-4 w-full justify-end'>
                            <Image
                                src="/eth-coin-logo.png"
                                width={30}
                                height={30}
                                alt={'eth-coin-logo'} />
                            <span>1 ETH</span>

                            <span>=</span>
                            <div className='w-8 h-8'>
                                <Image
                                    src="/usd-icon.png"
                                    width={30}
                                    height={30}
                                    alt={'usd-icon'} />
                            </div>
                            <span>{ETH_USD_RATE} USD</span>
                        </div>
                        <div className='flex gap-4 w-full justify-between'>
                            <span>Price/ticket:</span>
                            <strong>$ {PRICE_USD} USD</strong>
                        </div>
                        <hr></hr>
                        <div className='flex gap-4 w-full justify-between'>
                            <span>Total: </span>
                            <div >
                                <strong>$ {ticket.totalValueUSD} USD</strong>
                                <strong> - ⟠ {ticket.totalValueETH?.toFixed(7)} ETH</strong>
                            </div>
                        </div>
                        <div className='text-right text-xs italic'>Maximum quantity 100 tickets each kind/round</div>
                    </div>
                    <div className="flex justify-end">
                        <button className='w-full rounded-lg px-3 py-2 text-sm font-medium bg-orange-500 text-gray-100 hover:bg-orange-600' onClick={() => {
                            setOpenDialog(false);
                            selectedTickets(ticket)
                        }}>Approve</button>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}