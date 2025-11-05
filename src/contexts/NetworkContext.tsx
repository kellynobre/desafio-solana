"use client";

import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { clusterApiUrl } from '@solana/web3.js';
import { createContext, FC, ReactNode, useContext, useMemo, useState } from 'react';

export interface NetworkContextState {
    network: WalletAdapterNetwork;
    endpoint: string;
    setNetwork: (network: WalletAdapterNetwork) => void;
}

export const NetworkContext = createContext<NetworkContextState>({} as NetworkContextState);

export function useNetwork(): NetworkContextState {
    return useContext(NetworkContext);
}

// Lendo as URLs de RPC do seu arquivo .env.local
const RPC_URL_MAINNET = process.env.NEXT_PUBLIC_RPC_URL_MAINNET;
const RPC_URL_DEVNET = process.env.NEXT_PUBLIC_RPC_URL_DEVNET;

export const NetworkProvider: FC<{ children: ReactNode }> = ({ children }) => {
    // Padrão é Devnet, como pedido no desafio
    const [network, setNetwork] = useState<WalletAdapterNetwork>(WalletAdapterNetwork.Devnet);

    // Lógica atualizada para usar seu RPC dedicado
    const endpoint = useMemo(() => {
        if (network === WalletAdapterNetwork.Mainnet) {
            // Usa seu RPC dedicado. Se não estiver configurado no .env, usa o público (clusterApiUrl) como fallback.
            if (!RPC_URL_MAINNET) {
                console.warn("RPC Mainnet não configurado em .env.local, usando endpoint público (pode falhar).");
            }
            return RPC_URL_MAINNET || clusterApiUrl(network);
        }
        if (network === WalletAdapterNetwork.Devnet) {
            // Usa seu RPC dedicado. Se não estiver configurado no .env, usa o público (clusterApiUrl) como fallback.
            if (!RPC_URL_DEVNET) {
                console.warn("RPC Devnet não configurado em .env.local, usando endpoint público (pode falhar).");
            }
            return RPC_URL_DEVNET || clusterApiUrl(network);
        }
        
        // Para Testnet (que você incluiu), mantém o público, pois não é crítico
        return clusterApiUrl(network);

    }, [network]);

    return (
        <NetworkContext.Provider value={{ network, endpoint, setNetwork }}>
            {children}
        </NetworkContext.Provider>
    );
};