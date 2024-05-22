'use client';

import { useState } from "react"

export default function LastResult() {
    const [results, setResults] = useState([112, 454, 622, 123, 456, "***"])
    return (
        <div className="flex items-center justify-evenly md:gap-x-3 py-3 w-full  flex-wrap gap-1">
            {results.map((res, i) => {
                let bgCl = 'bg-orange-500'
                let txtCl = 'text-white'
                if (i % 2 !== 0) {
                    bgCl = 'bg-white'
                    txtCl = 'text-orange-500'
                }
                return (
                    <div key={i} className="flex gap-1 px-2 py-1 border rounded-xl border-gray-200 bg-gray-200">
                        {res.toString().split('').map((num, i) => {
                            return (
                                <div key={i} className={`${bgCl} border rounded-full w-5 h-5 leading-5 text-sm text-center flex items-center justify-center`}>
                                    <span className={`${txtCl} font-bold`}>{num}</span>
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}