// Types based on your GraphQL schema

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  suspended: boolean;
  deleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoggedInUser {
  id: string;
  token: string;
}

export interface CreatedUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface WalletBalance {
  address: string;
  balance: string;
  formattedBalance?: string;
  network: string;
  usdValue?: string;
  lastUpdated: Date;
}

export interface CreatedWallet {
  id: string;
  address: string;
  balance?: string;
  network?: string;
  mnemonic?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted: boolean;
  user: User;
}

// Transaction from Alchemy API
export interface AlchemyTransaction {
  hash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  status: string;
  timestamp: string;
  blockNumber: string;
  confirmations: number;
  gasPrice: string;
  gasUsed: string;
  asset?: string;
  category?: string;
}

// Transaction from Etherscan API
export interface EtherTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  blockNumber: string;
  timeStamp: string;
  confirmations: number;
  gas: string;
  gasUsed: string;
  transactionIndex: string;
  isError: string;
  txreceipt_status: string;
  blockHash: string;
  nonce: string;
  contractAddress?: string;
  cumulativeGasUsed: string;
  asset?: string;
}

// Generic transaction type for backward compatibility
export interface Transaction {
  hash: string;
  fromAddress: string;
  toAddress: string;
  value: string;
  status: string;
  timestamp: Date;
  blockNumber: string;
  confirmations?: number;
  gasPrice?: string;
  gasUsed?: string;
  asset?: string;
  category?: string;
}

export interface TransferFundsInput {
  toAddress: string;
  amount: number;
  memo?: string;
}

export interface TransactionHashResponse {
  hash: string;
}
