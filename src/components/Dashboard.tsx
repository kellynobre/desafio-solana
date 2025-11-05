"use client";

import React, { useState, useCallback, useEffect } from 'react';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  ParsedAccountData,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import bs58 from 'bs58';
import { useNetwork } from '@/contexts/NetworkContext'; 


const KNOWN_TOKENS = new Map<string, { symbol: string; name: string }>([
  ['EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v', { symbol: 'USDC', name: 'USD Coin' }],
  ['Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr', { symbol: 'USDC', name: 'USD Coin (Devnet)' }],
]);

interface TokenAccount {
  mint: string;
  amount: string;
  decimals: number;
}

export const Dashboard: React.FC = () => {
  const { network } = useNetwork(); 
  const { connection } = useConnection();
  const { publicKey, signMessage } = useWallet();

  const [solBalance, setSolBalance] = useState<number>(0);
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccount[]>([]);
  const [signatures, setSignatures] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [airdropSignature, setAirdropSignature] = useState('');
  const [signedMessage, setSignedMessage] = useState('');
  const [status, setStatus] = useState('');

  const getSolBalance = useCallback(async () => {
    if (!publicKey) return;
    try {
      const balance = await connection.getBalance(publicKey);
      setSolBalance(balance / LAMPORTS_PER_SOL);
    } catch (error) {
      console.error('Erro ao buscar saldo de SOL:', error);
      setStatus('Erro ao buscar saldo de SOL.');
    }
  }, [publicKey, connection]);

  const getTokenBalances = useCallback(async () => {
    if (!publicKey) return;
    try {
      const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
        publicKey,
        { programId: TOKEN_PROGRAM_ID }
      );

      const accounts: TokenAccount[] = tokenAccounts.value.map(account => {
        const parsedAccountInfo = account.account.data as ParsedAccountData;
        const tokenInfo = parsedAccountInfo.parsed.info;
        
        return {
          mint: tokenInfo.mint,
          amount: tokenInfo.tokenAmount.uiAmountString,
          decimals: tokenInfo.tokenAmount.decimals,
        };
      });
      setTokenAccounts(accounts);
    } catch (error) {
      console.error('Erro ao buscar balanço de tokens:', error);
      setStatus('Erro ao buscar balanço de tokens.');
    }
  }, [publicKey, connection]);

  const getTransactionHistory = useCallback(async () => {
      if (!publicKey) return;
      try {
          const signatureInfos = await connection.getSignaturesForAddress(publicKey, { limit: 5 });
          const sigs = signatureInfos.map(sigInfo => sigInfo.signature);
          setSignatures(sigs);
      } catch (error) {
          console.error('Erro ao buscar histórico de transações:', error);
      }
  }, [publicKey, connection]);


  useEffect(() => {
    if (publicKey) {
      setStatus('Carregando dados da conta...');
      setIsLoading(true);
      
      Promise.all([
        getSolBalance(), 
        getTokenBalances(),
        getTransactionHistory()
      ]).finally(() => {
        setIsLoading(false);
        setStatus('Dados carregados.');
      });
    } else {
      setSolBalance(0);
      setTokenAccounts([]);
      setSignatures([]);
      setIsLoading(false);
      setStatus('');
      setAirdropSignature('');
      setSignedMessage('');
    }
  }, [publicKey, getSolBalance, getTokenBalances, getTransactionHistory, network]); // 'network' como dependência

  const handleAirdrop = useCallback(async () => {
    if (!publicKey) return;
    if (network !== 'devnet') {
        setStatus('Airdrop só está disponível na Devnet.');
        return;
    }
    try {
      setStatus('Solicitando airdrop...');
      setIsLoading(true); 
      const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
      await connection.confirmTransaction(signature, 'confirmed'); 
      setAirdropSignature(signature);
      setStatus(`Airdrop concluído!`);
   
      getSolBalance(); 
      getTransactionHistory();
    } catch (error) {
      console.error('Falha no Airdrop:', error);
      setStatus('Falha no Airdrop. Tente novamente mais tarde.');
    } finally {
      setIsLoading(false); 
    }
  }, [publicKey, connection, getSolBalance, getTransactionHistory, network]);

  const handleSignMessage = useCallback(async () => {
      if (!publicKey || !signMessage) return;
      try {
        setStatus('Aguardando assinatura na carteira...');
        const message = new TextEncoder().encode('Esta é uma mensagem de teste para provar posse.');
        const signature = await signMessage(message);
        setSignedMessage(bs58.encode(signature));
        setStatus('Mensagem assinada com sucesso!');
      } catch (error) {
        console.error('Erro ao assinar mensagem:', error);
        setStatus('Falha ao assinar mensagem (rejeitado pelo usuário?).');
      }
  }, [publicKey, signMessage]);


  if (!publicKey) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-white">
            <h2 className="text-2xl font-semibold mb-4">Conecte sua carteira para começar.</h2>
            <p className="text-gray-400">Conecte uma carteira compatível com Solana para visualizar seu saldo e interagir com o aplicativo.</p>
        </div>
    );
  }

  return (
    <div className="p-8 text-white max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
       
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Informações da Conta</h2>
          <p className="truncate"><strong>Endereço:</strong> {publicKey.toBase58()}</p>
          <p><strong>Saldo SOL:</strong> {isLoading ? 'Carregando...' : `${solBalance.toFixed(4)} SOL`}</p>
        </div>
        
       
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Ações</h2>
          <div className="flex flex-col space-y-4">
              <button onClick={handleAirdrop} disabled={network !== 'devnet' || isLoading} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                {isLoading ? 'Processando...' : 'Airdrop 2 SOL (Devnet)'}
              </button>
              <button onClick={handleSignMessage} disabled={isLoading} className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 disabled:bg-gray-500">
                Assinar Mensagem
              </button>
          </div>
        </div>
      </div>

     
      {(status || airdropSignature || signedMessage) && ( 
        <div className="bg-gray-700 p-4 rounded-lg mt-8 text-sm break-words">
            <p><strong>Status:</strong> {status}</p>
            {airdropSignature && <p><strong>Último Airdrop TX:</strong> <a href={`https://explorer.solana.com/tx/${airdropSignature}?cluster=${network}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">{airdropSignature}</a></p>}
            {signedMessage && <p><strong>Última Assinatura (Base58):</strong> {signedMessage}</p>}
        </div>
      )}

     
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-xl font-bold mb-4">Últimas 5 Transações</h2>
          {isLoading ? <p>Carregando histórico...</p> : (
            signatures.length > 0 ? (
              <ul className="space-y-3">
                {signatures.map((sig, i) => (
                  <li key={i} className="p-3 bg-gray-700 rounded truncate">
                    <a 
                      href={`https://explorer.solana.com/tx/${sig}?cluster=${network}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline font-mono text-sm"
                    >
                      {sig}
                    </a>
                  </li>
                ))}
              </ul>
            ) : <p>Nenhuma transação encontrada.</p>
          )}
      </div>

   
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mt-8">
          <h2 className="text-xl font-bold mb-4">Tokens SPL</h2>
          {isLoading ? <p>Carregando tokens...</p> : (
            tokenAccounts.length > 0 ? (
              <ul className="space-y-3">
               
                {tokenAccounts.map((token, i) => {
                  const knownToken = KNOWN_TOKENS.get(token.mint);
                  
                  return (
                    <li key={i} className="p-3 bg-gray-700 rounded flex justify-between items-center">
                      <div>
                        <p className="font-bold text-lg">
                          {knownToken ? knownToken.symbol : 'Token Desconhecido'}
                        </p>
                        <p className="font-mono text-xs text-gray-400 truncate" title={token.mint}>
                          {token.mint}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-lg">{token.amount}</p>
                        <p className="text-xs text-gray-400">Decimais: {token.decimals}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : <p>Nenhum token SPL encontrado.</p>
          )}
      </div>
    </div>
  );
};