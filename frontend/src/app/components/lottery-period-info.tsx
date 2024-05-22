'use client';

import Image from "next/image";
import LastResult from "./last-results";
import { useEffect, useState } from "react";

export default function LotteryPeriodInfo() {
    const [time, setTime] = useState({
        minutes: 9,
        seconds: 59
    })
    useEffect(() => {
        const interval = setInterval(() => {
            time.seconds -= 1

            if (time.seconds == 0) {
                time.seconds = 59
                time.minutes -= 1
            }
            if (time.minutes == 0) {
                time.seconds = 59
                time.minutes = 9
            }
            setTime({
                minutes: time.minutes,
                seconds: time.seconds
            })
        }, 1000)
        return () => {
            clearInterval(interval)
        }
    }, [])
    return (
        <div className="w-full border-2 lg:px-32 px-10 rounded-2xl border-gray-700">
            <div className="flex items-stretch justify-between gap-x-3 py-3 w-full">
                <div className="flex flex-col gap-1 items-center justify-evenly">
                    <p >Current Lottery Period</p>
                    <p className="text-xl font-bold">#001</p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-5xl font-clock border-2 py-2 px-6 rounded-2xl text-orange-500 border-orange-500 text-center" >
                    <p >{`0${time.minutes}`}</p>
                    <div>:</div>
                    <div >
                        <span >{time.seconds < 10 ? `0${time.seconds}` : time.seconds}</span>
                    </div>

                </div>
                <div className="flex flex-col gap-1 items-center justify-evenly">
                    <p >Predict result</p>
                    <div className="flex gap-2">
                        <Image
                            src="/dice-icon.png"
                            width={20}
                            height={20}
                            alt={'dice-icon'}
                            className="rotate-90" />
                        <Image
                            src="/dice-icon.png"
                            width={20}
                            height={20}
                            alt={'dice-icon'}
                            className="rotate-180" />
                        <Image
                            src="/dice-icon.png"
                            width={20}
                            height={20}
                            alt={'dice-icon'}
                            className="rotate-45" />
                    </div>
                </div>
            </div>
            <LastResult />
        </div >
    )
}