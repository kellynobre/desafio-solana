

"use client";


import { Buffer } from 'buffer';
global.Buffer = Buffer;

import React, { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { NetworkProvider, useNetwork } from "@/contexts/NetworkContext";


import "@solana/wallet-adapter-react-ui/styles.css";

const WalletApp: FC<{ children: ReactNode }> = ({ children }) => {
  const { endpoint } = useNetwork(); 

 
  const wallets = useMemo(
    () => [], 
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect> 
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const WalletContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  return (
    <NetworkProvider>
      <WalletApp>{children}</WalletApp>
    </NetworkProvider>
  );
};