import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import NavLinks from "./components/nav-links";
import { Providers } from "./providers";
import getPriceFeedETHUSD from "./blockchain/data-feeds";

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
          <NavLinks />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
