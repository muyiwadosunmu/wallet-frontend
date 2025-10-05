import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useAuth } from '../hooks/useAuth';
import {
  GET_WALLET_BALANCE_QUERY,
  GET_TRANSACTIONS_QUERY,
  GENERATE_WALLET_MUTATION,
  TRANSFER_FUNDS_MUTATION
} from '../lib/graphql';
import { TransferFundsInput, WalletBalance, CreatedWallet, EtherTransaction, TransactionHashResponse } from '../types';
import './Dashboard.css';

interface WalletBalanceResponse {
  getWalletBalance: WalletBalance;
}

interface TransactionsResponse {
  getTransactions: EtherTransaction[];
}

interface GenerateWalletResponse {
  generateWallet: CreatedWallet;
}

interface TransferResponse {
  transferFunds: TransactionHashResponse;
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

  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);
  
  const { data: transactionData, loading: transactionsLoading, refetch: refetchTransactions, error: txError } = 
    useQuery<TransactionsResponse>(GET_TRANSACTIONS_QUERY, {
      variables: { page, pageSize },
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
        setTimeout(() => refetchTransactions(), 3000); // Delay refetching transactions to allow time for the transaction to be processed
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
    try {
      // Try parsing as timestamp (seconds since epoch) first
      if (dateString.match(/^\d+$/)) {
        return new Date(parseInt(dateString) * 1000).toLocaleString();
      }
      // Otherwise parse as date string
      return new Date(dateString).toLocaleString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Unknown Date";
    }
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
        <div className="success-alert" style={{
          backgroundColor: "#ecfdf5",
          color: "#047857",
          padding: "16px",
          borderRadius: "8px",
          margin: "10px 0 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          border: "1px solid #a7f3d0"
        }}>
          <div>
            <p style={{ fontWeight: "bold", marginBottom: "4px" }}>Transaction Sent Successfully!</p>
            <p style={{ fontSize: "14px" }}>{transferSuccess}</p>
          </div>
          <button 
            onClick={() => setTransferSuccess(null)} 
            className="close-alert"
            style={{
              background: "none",
              border: "none",
              color: "#047857",
              fontSize: "20px",
              cursor: "pointer"
            }}
          >
            ×
          </button>
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
          <div className="section-header">
            <h2>Transaction History</h2>
            <button 
              onClick={() => refetchTransactions()} 
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
              Refresh Transactions
            </button>
          </div>
          
          {transactionsLoading ? (
            <div className="loading">Loading transactions...</div>
          ) : txError ? (
            <div className="error-message" style={{ 
              padding: "20px", 
              backgroundColor: "#fef2f2", 
              color: "#b91c1c",
              borderRadius: "6px",
              margin: "10px 0",
              textAlign: "center"
            }}>
              <p>Error loading transactions. Please try again.</p>
              <button 
                onClick={() => refetchTransactions()} 
                style={{ 
                  backgroundColor: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "4px",
                  marginTop: "10px",
                  cursor: "pointer"
                }}
              >
                Try Again
              </button>
            </div>
          ) : transactionData?.getTransactions?.length ? (
            <>
              <div className="transactions-list">
                {transactionData.getTransactions.map((tx) => {
                  const isOutgoing = tx.from.toLowerCase() === walletData?.getWalletBalance?.address?.toLowerCase();
                  const status = tx.isError === "0" ? "Success" : "Failed";
                  return (
                    <div key={tx.hash} className="transaction-item">
                      <div className="tx-main">
                        <div className="tx-info">
                          <div className="tx-type" style={{ 
                            color: isOutgoing ? "#dc2626" : "#16a34a",
                            fontWeight: "bold" 
                          }}>
                            {isOutgoing ? 'Sent' : 'Received'}
                          </div>
                          <div className="tx-amount">
                            {formatValue(tx.value)} ETH
                          </div>
                        </div>
                        <div className="tx-status" style={{ 
                          backgroundColor: status === "Success" ? "#ecfdf5" : "#fef2f2",
                          color: status === "Success" ? "#047857" : "#b91c1c",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontWeight: "500",
                          fontSize: "12px"
                        }}>
                          {status}
                        </div>
                      </div>
                      <div className="tx-details">
                        <p><strong>From:</strong> {tx.from}</p>
                        <p><strong>To:</strong> {tx.to}</p>
                        <p><strong>Hash:</strong> {tx.hash}</p>
                        <p><strong>Date:</strong> {formatDate(new Date(parseInt(tx.timeStamp) * 1000).toString())}</p>
                        <p><strong>Block:</strong> {tx.blockNumber}</p>
                        <p><strong>Confirmations:</strong> {tx.confirmations}</p>
                        <p><strong>Gas Used:</strong> {tx.gasUsed}</p>
                      </div>
                      <div className="tx-actions">
                        <a 
                          href={`https://sepolia.etherscan.io/tx/${tx.hash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            backgroundColor: "#f3f4f6",
                            color: "#4b5563",
                            borderRadius: "4px",
                            textDecoration: "none",
                            fontSize: "12px",
                            fontWeight: "500"
                          }}
                        >
                          View on Etherscan
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="pagination-controls" style={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: "10px", 
                marginTop: "20px" 
              }}>
                <button 
                  onClick={() => setPage(Math.max(1, page - 1))} 
                  disabled={page <= 1}
                  style={{ 
                    padding: "6px 12px", 
                    borderRadius: "4px", 
                    backgroundColor: page <= 1 ? "#e5e7eb" : "#4f46e5", 
                    color: page <= 1 ? "#9ca3af" : "white", 
                    cursor: page <= 1 ? "not-allowed" : "pointer",
                    border: "none"
                  }}
                >
                  Previous
                </button>
                <span style={{ padding: "6px 12px", backgroundColor: "#f3f4f6", borderRadius: "4px" }}>Page {page}</span>
                <button 
                  onClick={() => setPage(page + 1)} 
                  disabled={transactionData.getTransactions.length < pageSize}
                  style={{ 
                    padding: "6px 12px", 
                    borderRadius: "4px", 
                    backgroundColor: transactionData.getTransactions.length < pageSize ? "#e5e7eb" : "#4f46e5", 
                    color: transactionData.getTransactions.length < pageSize ? "#9ca3af" : "white", 
                    cursor: transactionData.getTransactions.length < pageSize ? "not-allowed" : "pointer",
                    border: "none"
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="no-transactions" style={{ 
              padding: "30px 20px", 
              textAlign: "center", 
              backgroundColor: "#f9fafb", 
              borderRadius: "8px", 
              marginTop: "15px" 
            }}>
              <p style={{ fontSize: "16px", color: "#6b7280" }}>No transactions found.</p>
              <p style={{ fontSize: "14px", color: "#9ca3af", marginTop: "10px" }}>
                When you send or receive funds, your transactions will appear here.
              </p>
              
              <div style={{ 
                marginTop: "20px", 
                padding: "15px", 
                backgroundColor: "#f0f9ff", 
                borderRadius: "8px",
                border: "1px solid #93c5fd",
                textAlign: "left",
                maxWidth: "500px",
                margin: "20px auto 0"
              }}>
                <p style={{ fontWeight: "bold", color: "#1e40af", marginBottom: "8px" }}>
                  Getting Started with Transactions
                </p>
                <ul style={{ fontSize: "14px", marginBottom: "10px", paddingLeft: "20px", color: "#4b5563" }}>
                  <li style={{ marginBottom: "8px" }}>Make sure your wallet has some test ETH</li>
                  <li style={{ marginBottom: "8px" }}>Use the "Send Funds" button above to make your first transaction</li>
                  <li style={{ marginBottom: "8px" }}>Transactions may take a minute to be confirmed on the blockchain</li>
                  <li style={{ marginBottom: "8px" }}>Click "Refresh Transactions" to see your latest transactions</li>
                </ul>
                {walletData?.getWalletBalance?.balance === "0" && (
                  <a 
                    href="https://cloud.google.com/application/web3/faucet" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-block",
                      backgroundColor: "#3b82f6",
                      color: "white",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      textDecoration: "none",
                      fontWeight: "bold",
                      fontSize: "14px",
                      marginTop: "10px"
                    }}
                  >
                    Get Test ETH
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};