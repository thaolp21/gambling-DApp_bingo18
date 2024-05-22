
import { Button, Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import Image from 'next/image';
import { KindTable } from '../variables/type';

export default function CartDetail({
    kindTable,
    setOpenDialog
}: {
    kindTable: KindTable,
    setOpenDialog: any
}) {

    return (
        <Dialog open={!!kindTable.cat} onClose={() => {
            setOpenDialog(false);
        }} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                <DialogPanel className="max-w-lg space-y-2 bg-white p-4 w-4/6 rounded-xl">
                    <DialogTitle className="text-xl font-bold text-orange-500 text-center">{kindTable.title?.toLocaleUpperCase()}</DialogTitle>
                    <div className='flex gap-2 justify-center items-center'>
                        <div className='w-2/6 flex justify-center items-center'>
                            <Image
                                src={kindTable.src!}
                                width={90}
                                height={90}
                                alt={'sum-detail'}
                                style={{ width: 'auto', height: 'auto' }} />
                        </div>
                        <p> {kindTable.des}</p>
                    </div>
                </DialogPanel>
            </div>
        </Dialog>
    )
}