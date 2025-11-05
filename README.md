# Solana dApp Challenge

Este é um frontend simples desenvolvido com Next.js e React para interagir com a blockchain Solana. A aplicação permite que os usuários conectem uma carteira, visualizem seu saldo de SOL, listem seus tokens SPL e realizem ações como solicitar um airdrop (em Devnet) e assinar mensagens.

## ✨ Funcionalidades

* **Conexão de Carteira**: Integração total com o Solana Wallet Adapter, detectando automaticamente carteiras padrão (Phantom, Solflare, Backpack).
* **Troca de Carteira**: Um botão "Mudar" customizado que permite ao usuário trocar de conta sem precisar desconectar.
* **Visualização de Saldo**: Exibe o saldo de SOL da carteira conectada (chamada RPC `getBalance`).
* **Listagem de Tokens SPL**: Mostra todos os tokens (fungíveis) na carteira do usuário, exibindo **Símbolo**, **Mint** e **Quantidade** (chamada RPC `getTokenAccountsByOwner` com `jsonParsed`).
* **Seleção de Rede**: Permite alternar facilmente entre `Devnet`, `Mainnet-Beta` e `Testnet`.

### 🚀 Bônus Implementados

* **(Bônus) Airdrop**: Um botão para solicitar SOL na rede Devnet.
* **(Bônus) Assinatura de Mensagem**: Um botão que utiliza a função `signMessage` da carteira para provar a posse do endereço, exibindo a assinatura em Base58.
* **(Bônus) Histórico de Transações**: Exibe as últimas 5 assinaturas de transações da carteira e links para o Explorer.

## 🛠️ Stack Utilizada

* **Framework**: Next.js 14 (com App Router)
* **Linguagem**: TypeScript
* **Blockchain**: `@solana/web3.js`
* **Conexão de Carteira**: `@solana/wallet-adapter` (React, React-UI)
* **RPC Dedicado**: Helius (para evitar erros 403/429)
* **Estilização**: Tailwind CSS

## 🏁 Setup e Instalação

### Pré-requisitos

* [Node.js](https://nodejs.org/) (versão 18.x ou superior)
* [Yarn](https://yarnpkg.com/) ou npm

### 1. Instalação Padrão

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)
    cd SEU-REPOSITORIO
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    # ou
    yarn install
    ```

### 2. Configuração de RPC (Obrigatório)

Os endpoints RPC públicos da Solana (`clusterApiUrl`) **bloqueiam** requisições de `localhost` (causando erros 403 "Forbidden" e 429 "Rate Limit"). Para rodar este projeto localmente, você **precisa** de uma URL de RPC dedicada.

1.  **Obtenha uma URL de RPC:**
    * Crie uma conta gratuita em um provedor como [Helius](https://helius.dev/) ou [QuickNode](https://www.quicknode.com/).
    * No seu painel, copie suas URLs de RPC para **Mainnet** e **Devnet**.

2.  **Crie o arquivo de ambiente:**
    * Na **raiz** do projeto (no mesmo nível do `package.json`), crie um arquivo chamado `.env.local`.

3.  **Adicione suas chaves ao arquivo:**
    * Cole suas chaves de RPC dentro do `.env.local`, como no exemplo abaixo:

    ```ini
    # .env.local
    # O prefixo NEXT_PUBLIC_ é obrigatório para o Next.js

    # Cole sua URL de Mainnet do Helius/QuickNode aqui
    NEXT_PUBLIC_RPC_URL_MAINNET=[https://sua-url-rpc-mainnet.com/api-key-aqui](https://sua-url-rpc-mainnet.com/api-key-aqui)

    # Cole sua URL de Devnet do Helius/QuickNode aqui
    NEXT_PUBLIC_RPC_URL_DEVNET=[https://sua-url-rpc-devnet.com/api-key-aqui](https://sua-url-rpc-devnet.com/api-key-aqui)
    ```

### 3. Inicie o Servidor

Após instalar as dependências e configurar o `.env.local`, inicie o servidor.

```bash
npm run dev
# ou
yarn dev