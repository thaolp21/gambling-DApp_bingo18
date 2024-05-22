import { Button } from "@headlessui/react"
import { KindTable, TicketInfo } from "../variables/type"
import { CATEGORY, KIND_OF_MATCH, KIND_OF_SUM } from "../variables/info"

export default function ButtonTicket({
    item,
    setTicketInfo,
    setIsOpenDialog,
    kindTable
}: {
    item: TicketInfo,
    setTicketInfo: any,
    setIsOpenDialog: any,
    kindTable: KindTable
}) {

    const oriStyle = {
        bgCl: '',
        textPrize: 'text-orange-500',
        bdCl: 'border-orange-300',
        textTit: 'text-black',
        textSize: 'text-md'
    }
    if (kindTable.cat == CATEGORY.SUM && kindTable.kind == KIND_OF_SUM.SUM) {
        oriStyle.bdCl = 'border-gray-400',
            oriStyle.bgCl = 'bg-gradient-to-r from-orange-500 to-orange-300',
            oriStyle.textPrize = 'text-black',
            oriStyle.textTit = 'text-white'
        oriStyle.textSize = 'text-sm'
    }
    if (kindTable.cat == CATEGORY.MATCH) {
        oriStyle.textSize = 'text-sm'
        // oriStyle.bdCl = 'border-black',
        oriStyle.bgCl = 'bg-white',
            oriStyle.textPrize = 'text-black'
    }
    const genTitBall = (nums: string) => {
        let bgCl = 'bg-orange-500'
        let txtCl = 'text-white'
        if (kindTable.kind === KIND_OF_MATCH.TWO_NUMBERS) {
            // bgCl = 'bg-gray-600'
            // txtCl = 'text-orange-500'
        }
        return nums.toString().split('').map((num, i) => {
            return (
                <div key={i} className={`${bgCl} border rounded-full w-7 h-7 leading-7 text-sm text-center flex items-center justify-center `}>
                    <span className={`${txtCl} font-bold `}>{num}</span>
                </div>
            )
        })
    }
    return (
        <Button
            onClick={() => {
                setTicketInfo(item)
                setTimeout(() => setIsOpenDialog(true), 0)
            }}
            className={`flex gap-1 flex-col p-2 rounded-md border-2 lottery-box items-center ${oriStyle.bgCl} ${oriStyle.bdCl} `}
        >
            <span className={`w-full ${oriStyle.textSize} ${oriStyle.textPrize} font-bold text-right leading-3 italic`}>{item.prizeValue}</span>
            {
                kindTable.cat === CATEGORY.SUM ? <strong className={`w-full ${oriStyle.textTit}`}>{item.title}</strong> : <div className="flex items-center justify-center py-2 w-full ">{genTitBall(item.title!)}</div>
            }
            {!!item.des && <span className='bg-gradient-to-r from-orange-100 via-orange-500 to-orange-100 w-2/6 text-center rounded-lg '>{item.des}</span>}
            {item.quantity ?
                <div className="casino-chip">
                    <div className="dashed-circle">{item.quantity}</div>
                </div> : null}
        </Button>
    )
}