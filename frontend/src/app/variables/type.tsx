import { CATEGORY, KIND_OF_MATCH, KIND_OF_SUM, SM_OPTIONS, SM_GLE_VALUE } from "./info"

export type TicketInfo = {
    code?: string, category?: string, kind?: number, title?: string, prizeValue?: string, des?: string | null, cl?: string, quantity?: number, totalValueETH?: number, totalValueUSD?: number, ETHUSDRate?: number
}
export type KindTable = {
    cat: CATEGORY | null,
    kind?: KIND_OF_SUM | KIND_OF_MATCH
    des?: string,
    hasDiffKind?: boolean,
    src?: string,
    title?: string
    subTitle?: string
}
export type DataUser = {
    address: string;
    tikets: TicketInfo[],
    total_ETH: number,
    total_USD: number,
    SCTickets?: SCTicket[]
}
export type SCTicket = {
    option: SM_OPTIONS,
    values: SCTicketValue[]
}
export type SCTicketValue = {
    value: number | SM_GLE_VALUE,
    amount: number
}