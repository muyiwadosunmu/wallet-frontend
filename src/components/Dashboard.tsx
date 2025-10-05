import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '../hooks/useAuth';
import {
  GET_WALLET_BALANCE_QUERY,
  GET_TRANSACTION_HISTORY_QUERY,
  GENERATE_WALLET_MUTATION,
  TRANSFER_FUNDS_MUTATION
} from '../lib/graphql';
import { TransferFundsInput, WalletBalance, Transaction, CreatedWallet } from '../types';
import './Dashboard.css';

interface WalletBalanceResponse {
  getWalletBalance: WalletBalance;
}

interface TransactionHistoryResponse {
  getTransactionHistory: Transaction[];
}

interface GenerateWalletResponse {
  generateWallet: CreatedWallet;
}

interface TransferResponse {
  transferFunds: Transaction;
}

export const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [transferData, setTransferData] = useState<TransferFundsInput>({
    toAddress: '',
    amount: 0,
    memo: '',
  });
  const [transferSuccess, setTransferSuccess] = useState<string | null>(null);

  // Queries
  const { data: walletData, loading: walletLoading, error: walletError, refetch: refetchWallet } = 
    useQuery<WalletBalanceResponse>(GET_WALLET_BALANCE_QUERY, {
      fetchPolicy: 'network-only', // Don't use cache, always make a network request
      notifyOnNetworkStatusChange: true
    });

  const { data: transactionData, loading: transactionsLoading, refetch: refetchTransactions } = 
    useQuery<TransactionHistoryResponse>(GET_TRANSACTION_HISTORY_QUERY, {
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true
    });

  // Mutations
  const [generateWallet, { loading: generatingWallet }] = useMutation<GenerateWalletResponse>(
    GENERATE_WALLET_MUTATION,
    {
      onCompleted: () => {
        refetchWallet();
      },
      onError: (error: Error) => {
        console.error('Error generating wallet:', error);
      }
    }
  );

  const [transferFunds, { loading: transferring }] = useMutation<TransferResponse>(
    TRANSFER_FUNDS_MUTATION,
    {
      onCompleted: (data: TransferResponse) => {
        setTransferSuccess(`Transfer successful! Transaction hash: ${data.transferFunds.hash}`);
        setShowTransferForm(false);
        setTransferData({ toAddress: '', amount: 0, memo: '' });
        refetchWallet();
        refetchTransactions();
      },
      onError: (error: Error) => {
        console.error('Transfer error:', error);
      }
    }
  );

  const handleGenerateWallet = () => {
    generateWallet();
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    transferFunds({
      variables: {
        input: transferData
      }
    });
  };

  const handleTransferChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTransferData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) || 0 : value
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatValue = (value: string | null | undefined) => {
    if (!value) return '0.00';
    
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return '0.00';
    
    // Check if the value is already in ETH (small number) or in Wei (large number)
    if (parsedValue < 1000) {
      return parsedValue.toFixed(6); // Already in ETH
    } else {
      return (parsedValue / 1e18).toFixed(6); // Convert from Wei to ETH
    }
  };
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        alert('Address copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  };

  if (walletError && walletError.message.includes('No wallet found')) {
    return (
      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Welcome, {user?.firstName}!</h1>
          <button onClick={logout} className="logout-btn">Logout</button>
        </div>
        
        <div className="no-wallet-container">
          <div className="no-wallet-card">
            <h2>No Wallet Found</h2>
            <p>You don't have a wallet yet. Generate one to get started!</p>
            <button 
              onClick={handleGenerateWallet} 
              disabled={generatingWallet}
              className="generate-wallet-btn"
            >
              {generatingWallet ? 'Generating...' : 'Generate Wallet'}
            </button>
            
            <div style={{ 
              marginTop: '30px', 
              padding: '15px', 
              backgroundColor: '#f0f9ff', 
              borderRadius: '8px',
              border: '1px solid #93c5fd',
              textAlign: 'left'
            }}>
              <p style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                About Test Networks
              </p>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                This wallet uses the Sepolia test network. After generating your wallet, you'll need test ETH to perform transactions.
              </p>
              <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                You can get free test ETH from:
              </p>
              <a 
                href="https://cloud.google.com/application/web3/faucet" 
                target="_blank" 
                rel="noopener noreferrer"
                style={{
                  display: 'inline-block',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  textDecoration: 'none',
                  fontWeight: 'bold',
                  fontSize: '14px'
                }}
              >
                Google Web3 Faucet
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName}!</h1>
        <button onClick={logout} className="logout-btn">Logout</button>
      </div>

      {transferSuccess && (
        <div className="success-alert">
          {transferSuccess}
          <button onClick={() => setTransferSuccess(null)} className="close-alert">×</button>
        </div>
      )}

      <div className="dashboard-content">
        {/* Wallet Balance Section */}
        <div className="wallet-section">
          <div className="section-header">
            <h2>Your Wallet</h2>
            <button 
              onClick={() => refetchWallet()} 
              className="refresh-btn"
              style={{ 
                backgroundColor: "#4f46e5", 
                color: "white",
                padding: "8px 16px",
                borderRadius: "6px",
                border: "none",
                cursor: "pointer"
              }}
            >
              Refresh Balance
            </button>
          </div>
          {walletLoading ? (
            <div className="loading">Loading wallet...</div>
          ) : walletData?.getWalletBalance ? (
            <div className="wallet-info">
              <div className="balance-card">
                <h3>Balance</h3>
                <div className="balance-amount">
                  {walletData.getWalletBalance.formattedBalance || formatValue(walletData.getWalletBalance.balance || '0')} ETH
                </div>
                <div className="balance-debug" style={{ fontSize: '10px', opacity: 0.7 }}>
                  Raw: {walletData.getWalletBalance.balance || 'N/A'}
                </div>
                {walletData.getWalletBalance.usdValue && (
                  <div className="balance-usd">
                    ≈ ${walletData.getWalletBalance.usdValue}
                  </div>
                )}
              </div>
              <div className="wallet-details">
                <p>
                  <strong>Address:</strong> 
                  <span style={{ marginRight: '10px' }}>{walletData.getWalletBalance.address}</span>
                  <button 
                    onClick={() => copyToClipboard(walletData.getWalletBalance.address)}
                    style={{ 
                      background: 'none',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      padding: '2px 8px',
                      fontSize: '12px',
                      cursor: 'pointer'
                    }}
                  >
                    Copy
                  </button>
                </p>
                <p><strong>Network:</strong> {walletData.getWalletBalance.network}</p>
                <p><strong>Last Updated:</strong> {walletData.getWalletBalance.lastUpdated ? formatDate(walletData.getWalletBalance.lastUpdated.toString()) : 'N/A'}</p>
                
                {(walletData.getWalletBalance.network?.toLowerCase().includes('sepolia') || 
                  walletData.getWalletBalance.network?.toLowerCase().includes('testnet')) && (
                  <div className="faucet-section" style={{ 
                    marginTop: '20px', 
                    padding: '15px', 
                    backgroundColor: '#f0f9ff', 
                    borderRadius: '8px',
                    border: '1px solid #93c5fd'
                  }}>
                    <p style={{ fontWeight: 'bold', color: '#1e40af', marginBottom: '8px' }}>
                      Need test ETH?
                    </p>
                    <p style={{ fontSize: '14px', marginBottom: '10px' }}>
                      This is a testnet wallet. Get free Sepolia ETH to test your wallet functionality.
                    </p>
                    <a 
                      href="https://cloud.google.com/application/web3/faucet" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-block',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        padding: '8px 16px',
                        borderRadius: '6px',
                        textDecoration: 'none',
                        fontWeight: 'bold',
                        fontSize: '14px'
                      }}
                    >
                      Google Web3 Faucet
                    </a>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="no-wallet">
              <button onClick={handleGenerateWallet} disabled={generatingWallet}>
                {generatingWallet ? 'Generating...' : 'Generate Wallet'}
              </button>
            </div>
          )}
        </div>

        {/* Transfer Section */}
        {walletData?.getWalletBalance && (
          <div className="transfer-section">
            <div className="section-header">
              <h2>Send Funds</h2>
              <button 
                onClick={() => setShowTransferForm(!showTransferForm)}
                className="toggle-transfer-btn"
              >
                {showTransferForm ? 'Cancel' : 'Send Funds'}
              </button>
            </div>

            {showTransferForm && (
              <form onSubmit={handleTransfer} className="transfer-form">
                <div className="form-group">
                  <label>To Address:</label>
                  <input
                    type="text"
                    name="toAddress"
                    value={transferData.toAddress}
                    onChange={handleTransferChange}
                    placeholder="0x..."
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Amount (ETH):</label>
                  <input
                    type="number"
                    name="amount"
                    value={transferData.amount}
                    onChange={handleTransferChange}
                    step="0.000001"
                    min="0"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Memo (optional):</label>
                  <textarea
                    name="memo"
                    value={transferData.memo}
                    onChange={handleTransferChange}
                    placeholder="Optional note for this transaction"
                  />
                </div>
                <button type="submit" disabled={transferring} className="transfer-btn">
                  {transferring ? 'Sending...' : 'Send Funds'}
                </button>
                
                <div style={{ 
                  marginTop: '20px', 
                  padding: '12px', 
                  backgroundColor: '#fffbeb', 
                  borderRadius: '6px',
                  border: '1px solid #fcd34d',
                  fontSize: '13px',
                  color: '#92400e'
                }}>
                  <p style={{ fontWeight: 'bold', marginBottom: '5px' }}>Remember:</p>
                  <ul style={{ paddingLeft: '20px', margin: '0' }}>
                    <li>This wallet uses Sepolia test ETH, which has no real value</li>
                    <li>If your balance is 0, get test ETH from the <a 
                      href="https://cloud.google.com/application/web3/faucet" 
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: '#b45309', textDecoration: 'underline' }}
                    >Google Web3 Faucet</a></li>
                    <li>Transactions may take a few minutes to be confirmed</li>
                  </ul>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Transaction History */}
        <div className="transactions-section">
          <h2>Transaction History</h2>
          {transactionsLoading ? (
            <div className="loading">Loading transactions...</div>
          ) : transactionData?.getTransactionHistory?.length ? (
            <div className="transactions-list">
              {transactionData.getTransactionHistory.map((tx: Transaction) => (
                <div key={tx.hash} className="transaction-item">
                  <div className="tx-main">
                    <div className="tx-info">
                      <div className="tx-type">
                        {tx.fromAddress.toLowerCase() === walletData?.getWalletBalance?.address?.toLowerCase() ? 'Sent' : 'Received'}
                      </div>
                      <div className="tx-amount">
                        {formatValue(tx.value)} ETH
                      </div>
                    </div>
                    <div className="tx-status" data-status={tx.status.toLowerCase()}>
                      {tx.status}
                    </div>
                  </div>
                  <div className="tx-details">
                    <p><strong>From:</strong> {tx.fromAddress}</p>
                    <p><strong>To:</strong> {tx.toAddress}</p>
                    <p><strong>Hash:</strong> {tx.hash}</p>
                    <p><strong>Date:</strong> {formatDate(tx.timestamp.toString())}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-transactions">
              <p>No transactions found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};