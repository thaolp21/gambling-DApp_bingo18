import { CATEGORY, KIND_OF_MATCH, KIND_OF_SUM, TICKET_CODE } from "./info";
import { KindTable, TicketInfo } from "./type";

export const KindTables: KindTable[] = [
    {
        cat: CATEGORY.SUM,
        des: 'Predict the total of 3 resulting numbers from 1 to 6 and placing a bet to Total-number boxes [from 3 to 18] or Big [12-18] - Draw [10-11] - Small [3-9] box',
        hasDiffKind: true,
        kind: KIND_OF_SUM.SUM,
        src: '/sum-detail.png',
        title: 'sum'
    },
    {
        cat: CATEGORY.MATCH,
        des: 'Predict that 3 identical numbers will appear in the results.',
        hasDiffKind: false,
        kind: KIND_OF_MATCH.THREE_NUMBERS,
        src: '/three-balls.png',
        title: 'match 3 numbers'
    },
    {
        cat: CATEGORY.MATCH,
        des: 'Predict that 2 identical numbers will appear in the results.',
        hasDiffKind: false,
        kind: KIND_OF_MATCH.TWO_NUMBERS,
        src: '/two-balls.png',
        title: 'match 2 numbers'
    },
    {
        cat: CATEGORY.MATCH,
        des: 'Predict correctly a number that will appear in the results.',
        hasDiffKind: false,
        kind: KIND_OF_MATCH.ONE_NUMBER,
        src: '/six-balls.png',
        title: 'match 1 numbers',
        subTitle: '1-1.2_2-2_3-3'
    },
]
const codeTwoNums = [
    'MATCH_2_1',
    'MATCH_2_2',
    'MATCH_2_3',
    'MATCH_2_4',
    'MATCH_2_5',
    'MATCH_2_6',]
const codeThreeNums = [
    'MATCH_3_1',
    'MATCH_3_2',
    'MATCH_3_3',
    'MATCH_3_4',
    'MATCH_3_5',
    'MATCH_3_6',
    'MATCH_3_7',
]
const codeOneNum = [
    'MATCH_1_1',
    'MATCH_1_2',
    'MATCH_1_3',
    'MATCH_1_4',
    'MATCH_1_5',
    'MATCH_1_6',
]
const genTitle = (character: number, numCharacters: number) => {
    let repeatNum = numCharacters
    if (numCharacters == 1) {
        repeatNum = 3
    } else if (numCharacters == 3) repeatNum = 1
    return '' + Array(repeatNum).fill(null).reduce((res) => {
        const char = character < 7 ? character : "*"
        res += char
        return res
    }, '')
}
const genTicketsInfo = (codes: string[]) => {
    // generate tickets MATCH 2 numbers

    return codes.map((code) => {
        const keys = code.split('_')
        let kind = KIND_OF_MATCH.ONE_NUMBER
        let prizeValue = ''
        let title = genTitle(Number(keys[2]), 3)
        switch (keys[1]) {
            case '2':
                kind = KIND_OF_MATCH.TWO_NUMBERS
                prizeValue = 'x7.5'
                title = genTitle(Number(keys[2]), 2)
                break;
            case '3':
                kind = KIND_OF_MATCH.THREE_NUMBERS
                prizeValue = keys[2] == "7" ? 'x20' : 'x120'
                title = genTitle(Number(keys[2]), 1)
                break;
        }
        const tkInfo: TicketInfo = {
            code,
            category: keys[0],
            kind,
            title,
            prizeValue,
            des: null,
            quantity: 0
        }
        return tkInfo
    })
}
export const SumTickets: TicketInfo[] = [
    {
        code: TICKET_CODE.SUM_SMALL,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.RANGE,
        title: "SMALL",
        prizeValue: 'x1.5',
        des: '3-9',
        cl: '#fff',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_DRAW,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.RANGE,
        title: "DRAW",
        prizeValue: 'x2',
        des: '10-11',
        cl: '#fb923c',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_BIG,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.RANGE,
        title: "BIG",
        prizeValue: 'x1.5',
        des: '12-18',
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_3,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "3",
        prizeValue: 'x120',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_4,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "4",
        prizeValue: 'x40',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_5,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "5",
        prizeValue: 'x20',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_6,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "6",
        prizeValue: 'x12',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_7,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "7",
        prizeValue: 'x8',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_8,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "8",
        prizeValue: 'x5.5',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_9,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "9",
        prizeValue: 'x4.7',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_10,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "10",
        prizeValue: 'x4.4',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_11,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "11",
        prizeValue: 'x4.4',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_12,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "12",
        prizeValue: 'x4.7',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_13,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "13",
        prizeValue: 'x5.5',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_14,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "14",
        prizeValue: 'x8',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_15,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "15",
        prizeValue: 'x12',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_16,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "16",
        prizeValue: 'x20',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_17,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "17",
        prizeValue: 'x40',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    {
        code: TICKET_CODE.SUM_18,
        category: CATEGORY.SUM,
        kind: KIND_OF_SUM.SUM,
        title: "18",
        prizeValue: 'x120',
        des: null,
        cl: '#f87171',
        quantity: 0,
    },
    // {
    //     code: TICKET_CODE.MATCH_1_1,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "111",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_2,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "222",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_3,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "333",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_4,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "444",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_5,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "555",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_6,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "666",
    //     prizeValue: 'x120',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
    // {
    //     code: TICKET_CODE.MATCH_1_7,
    //     category: CATEGORY.MATCH,
    //     kind: KIND_OF_MATCH.ONE_NUMBER,
    //     title: "***",
    //     prizeValue: 'x20',
    //     des: null,
    //     cl: '#f87171',
    //     quantity: 0,
    // },
]
export const AllTickets: TicketInfo[] = [
    ...SumTickets,
    ...genTicketsInfo(codeOneNum),
    ...genTicketsInfo(codeTwoNums),
    ...genTicketsInfo(codeThreeNums)
]
