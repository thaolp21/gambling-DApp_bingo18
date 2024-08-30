'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';
import Image from 'next/image';
import CartModal from './modal';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function NavLinks({
    // links,
}: {
        // links: { href: string; name: string }[];
    }) {
    const links = [
        { href: '/', name: 'Home' },
        { href: '/history', name: 'History' },
        { href: '/drawing-result', name: 'Drawing result' },
    ];
    const pathname = usePathname();

    return (
        <div className="flex items-center justify-between gap-x-3 p-3">
            <nav className="flex gap-2">
                {links.map((link, i) => {
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={i}
                            href={link.href}
                            className={clsx('rounded-lg px-3 py-1 font-medium', {
                                'bg-orange-500 text-white transition-all hover:scale-105': isActive,
                            })}
                        >
                            {link.name}
                        </Link>
                    );
                })}
            </nav>
            <div className='flex justify-end'
            >
                <ConnectButton />
            </div>
        </div>

    );
}