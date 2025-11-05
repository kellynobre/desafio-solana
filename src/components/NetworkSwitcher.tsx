"use client";

import { useNetwork } from '@/contexts/NetworkContext';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';

export const NetworkSwitcher = () => {
    const { network, setNetwork } = useNetwork();

    return (
        <select
            value={network}
            onChange={(e) => setNetwork(e.target.value as WalletAdapterNetwork)}
            className="bg-gray-800 text-white p-2 rounded-md focus:outline-none"
        >
            <option value={WalletAdapterNetwork.Devnet}>Devnet</option>
            <option value={WalletAdapterNetwork.Mainnet}>Rede Principal</option>
            <option value={WalletAdapterNetwork.Testnet}>Rede de Testes</option>
        </select>
    );
};
