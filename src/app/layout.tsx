import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { WalletContextProvider } from "./providers"; 

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Solana dApp Challenge",
  description: "Simple frontend for Solana wallet interactions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <WalletContextProvider>{children}</WalletContextProvider> 
      </body>
    </html>
  );
}