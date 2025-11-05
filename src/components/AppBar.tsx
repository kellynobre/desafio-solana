"use client";

import React, { FC } from "react";
import { NetworkSwitcher } from "./NetworkSwitcher";
import dynamic from 'next/dynamic';
import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';


const WalletMultiButtonDynamic = dynamic(
    async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
    { 
        ssr: false, 
        loading: () => (
            <div
                className="bg-gray-800 rounded-lg animate-pulse"
                style={{ height: "48px", width: "180px" }} 
            />
        )
    }
);


const ChangeWalletButton: FC = () => {
    const { connected } = useWallet();
    const { setVisible } = useWalletModal();

    
    if (!connected) {
        return null;
    }

    
    return (
        <button
            onClick={() => setVisible(true)} 
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
            style={{ height: "48px" }}
        >
            Mudar
        </button>
    );
}


const ChangeWalletButtonDynamic = dynamic(
    async () => ChangeWalletButton,
    { 
        ssr: false,
       
    }
);


export const AppBar: FC = () => {
  return (
    <div className="bg-gray-900 p-4 shadow-lg flex justify-between items-center">
      <h1 className="text-2xl font-bold text-white">Aplicativo Solana</h1>
      <div className="flex items-center space-x-4">
        <NetworkSwitcher />

       
        <WalletMultiButtonDynamic 
          style={{ backgroundColor: '#4F46E5' }} 
        />

      
        <ChangeWalletButtonDynamic />
      </div>
    </div>
  );
};