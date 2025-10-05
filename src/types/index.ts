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
