import { gql } from "@apollo/client";

// Authentication mutations
export const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      id
      token
    }
  }
`;

export const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      id
      email
      firstName
      lastName
    }
  }
`;

// Wallet mutations
export const GENERATE_WALLET_MUTATION = gql`
  mutation GenerateWallet {
    generateWallet {
      id
      address
      balance
      network
      mnemonic
      createdAt
      user {
        id
        email
        firstName
        lastName
      }
    }
  }
`;

export const TRANSFER_FUNDS_MUTATION = gql`
  mutation TransferFunds($input: TransferFundsInput!) {
    transferFunds(input: $input) {
      hash
    }
  }
`;

// Queries
export const GET_ME_QUERY = gql`
  query GetMe {
    me {
      id
      email
      firstName
      lastName
      createdAt
      updatedAt
      suspended
      deleted
    }
  }
`;

export const GET_WALLET_BALANCE_QUERY = gql`
  query GetWalletBalance {
    getWalletBalance {
      address
      balance
      formattedBalance
      network
      usdValue
      lastUpdated
    }
  }
`;

export const GET_TRANSACTIONS_QUERY = gql`
  query GetTransactions($page: Int, $pageSize: Int) {
    getTransactions(page: $page, pageSize: $pageSize) {
      hash
      from
      to
      value
      blockNumber
      timeStamp
      confirmations
      gas
      gasUsed
      transactionIndex
      isError
      txreceipt_status
    }
  }
`;

export const GET_TRANSACTION_QUERY = gql`
  query GetTransaction($hash: String!) {
    getTransaction(hash: $hash) {
      hash
      fromAddress
      toAddress
      value
      status
      timestamp
      blockNumber
      confirmations
      gasPrice
      gasUsed
      asset
      category
    }
  }
`;

export const GET_ADDRESS_BALANCE_QUERY = gql`
  query GetAddressBalance($address: String!) {
    getAddressBalance(address: $address) {
      address
      balance
      formattedBalance
      network
      usdValue
      lastUpdated
    }
  }
`;
