import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import 'react-toastify/dist/ReactToastify.css'
import { Providers } from "./providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bingo18",
  description: "Self-selected Lottery",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className="h-full [color-scheme:dark]">
      <body>
        <Providers>
          {/* <NavLinks /> */}
          <div className="flex justify-end items-center gap-x-3 p-3"
          >
            <ConnectButton />
          </div>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
