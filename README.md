# Ethereum Wallet Frontend

![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Apollo](https://img.shields.io/badge/Apollo-Client-purple)
![GraphQL](https://img.shields.io/badge/GraphQL-API-pink)

A modern cryptocurrency wallet application built with React and TypeScript. This frontend provides an intuitive interface for managing Ethereum wallets on the Sepolia testnet.

## ✨ Features

- **User Authentication** - Create an account and securely log in
- **Wallet Management** - Generate and manage Ethereum wallets
- **Real-time Balances** - View your ETH balance
- **Send & Receive** - Transfer ETH to any address
- **Transaction History** - View your complete transaction history
- **Test ETH Integration** - Built-in access to Sepolia test ETH faucets

## Hosted Page on Cloudflare Pages
https://wallet-app-e8u.pages.dev/

## 🔧 Technology Stack

- **Frontend**: React 18, TypeScript, Apollo Client
- **Build Tools**: Vite
- **Styling**: Custom CSS
- **Network**: Sepolia Ethereum Testnet

## 🚀 Getting Started

### Prerequisites
- Node.js (v22+)
- npm or yarn

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wallet-frontend.git
   cd wallet-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Access the application**
   
   Open your browser and navigate to: `http://localhost:5173`

## 🌐 API Connection

This application connects to a GraphQL backend API:

- **Repository**: [wallet-api](https://github.com/muyiwadosunmu/wallet-api)
- **Endpoint**: `https://wallet-api-ylqb.onrender.com/graphql`

## 📋 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build



## ⚙️ Configuration

Create a `.env` file in the project root:

```
VITE_GRAPHQL_URL=https://wallet-api-ylqb.onrender.com/graphql
```

## 🧪 Using the Wallet

After creating your account:

1. Generate a new wallet
2. Get free test ETH from [Google Web3 Faucet](https://cloud.google.com/application/web3/faucet)
3. Send test transactions between wallets
4. Track your transactions in the history section

## 🔒 Security Features

- JWT authentication
- Protected routes


[MIT](LICENSE)
