'use client';

import { Button } from "@headlessui/react";
import React, { SetStateAction, useState } from "react";
import CartModal from "./modal";
import { CATEGORY, KIND_OF_MATCH, KIND_OF_SUM, TICKET_CODE } from "../variables/info";
import { KindTables, AllTickets } from '../variables/tickets'
import '../style/home-page.css'
import CartDetail from "./dialog-detail";
import ButtonTicket from "./button-ticket";
import { KindTable, TicketInfo } from "../variables/type";


const LotteryTable = ({
    getSelectedTickets,
    homeTickets,
    priceFeedETHUSD
}: {
    getSelectedTickets: any,
    homeTickets: TicketInfo[],
    priceFeedETHUSD: number
}) => {
    const biDrSmTis: TicketInfo[] = AllTickets
    const [isOpenDialog, setIsOpenDialog] = useState(false);
    const [kindTable, setKindTable] = useState<KindTable>({ cat: null });
    const [ticketInfo, setTicketInfo] = useState<TicketInfo>({})
    const [tickets, setTickets] = useState<TicketInfo[]>(homeTickets)
    const setSelectedTicket = (res: TicketInfo) => {
        tickets[tickets.findIndex((el) => el.code === res.code)] = res
        setTickets(tickets)
        getSelectedTickets(tickets)
    }
    const renderBtnTk = (kt: KindTable, specKind?: KIND_OF_SUM) => {
        const { cat, kind } = kt
        const kindFilter = specKind !== undefined ? specKind : kind
        return tickets.filter(e => e.category === cat && e.kind === kindFilter).map((el, i) => {
            return (
                <ButtonTicket key={i} item={el} setTicketInfo={(res: TicketInfo) => setTicketInfo(res)} setIsOpenDialog={(res: boolean) => setIsOpenDialog(res)} kindTable={{ ...kt, kind: kindFilter }} />
            )
        })
    }

    const renderPartOfTbl = (k: KindTable, i: number) => {
        const subTits = k.subTitle?.split('_')
        return (
            <div key={i} className="flex flex-col gap-3 last:gap-2 justify-center items-center lott-tbl-child pb-6">
                <div className="flex gap-2 justify-center items-center">
                    <p className="text-xl font-bold text-orange-500">{k.title?.toLocaleUpperCase()}</p>
                    <Button onClick={() => setKindTable(k)}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                        </svg>
                    </Button>

                </div>
                {
                    subTits?.length && <div className="flex gap-1 pb-1">
                        {subTits.map((e, i) => {
                            const chars = e.split('-')
                            return <span key={i} className="border-r-2 px-2 border-orange-500 text-sm italic font-semibold last:border-r-0 ">{chars[0]} number x{chars[1]}</span>
                        })}
                    </div>
                }
                {
                    k.hasDiffKind ?
                        <React.Fragment>
                            <div className="w-full grid gap-8 grid-cols-3 grid-rows-1">
                                {renderBtnTk(k, KIND_OF_SUM.RANGE)}
                            </div>
                            <div className="w-full grid gap-3 grid-cols-8 grid-rows-2">
                                {renderBtnTk(k, KIND_OF_SUM.SUM)}
                            </div>
                        </React.Fragment> :
                        <React.Fragment>
                            <div className={`w-full grid gap-3 ${k.kind === KIND_OF_MATCH.THREE_NUMBERS ? 'grid-cols-7' : 'grid-cols-6'} grid-rows-1`}>
                                {renderBtnTk(k)}
                            </div>
                        </React.Fragment>
                }
            </div>
        )
    }
    return (
        <React.Fragment>
            <div className="w-full">
                {KindTables.map((e, i) => {
                    return renderPartOfTbl(e, i)
                })}
                {isOpenDialog && <div className="ticket-dialog">
                    <CartModal priceFeedETHUSD={priceFeedETHUSD} openDialog={isOpenDialog} setOpenDialog={setIsOpenDialog} ticketInfo={ticketInfo} selectedTickets={(res: TicketInfo) => setSelectedTicket(res)} />
                </div>}
                {kindTable.cat && <div className="detail-dialog">
                    <CartDetail kindTable={kindTable} setOpenDialog={setKindTable} />
                </div>}
            </div>
        </React.Fragment>
    );
}


export default LotteryTable