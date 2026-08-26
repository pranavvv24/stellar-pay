import React from 'react';
import CopyButton from './CopyButton';

interface TransactionStatusProps {
  status: 'idle' | 'awaiting_signature' | 'processing' | 'success' | 'error';
  amount?: string;
  recipient?: string;
  hash?: string;
  errorMessage?: string;
}

const TransactionStatus: React.FC<TransactionStatusProps> = ({ status, amount, recipient, hash, errorMessage }) => {
  if (status === 'idle') return null;

  return (
    <div className="card flex flex-col gap-4 animate-fade-in">
      <h2 className="text-lg font-medium">Transaction Status</h2>
      
      {status === 'awaiting_signature' && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
          <p className="text-sm font-medium">Waiting for Freighter approval...</p>
        </div>
      )}

      {status === 'processing' && (
        <div className="flex flex-col items-center justify-center gap-3 py-6">
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid var(--color-border)', borderTopColor: 'var(--color-accent)', animation: 'spin 1s linear infinite' }} />
          <p className="text-sm font-medium">Submitting to network...</p>
        </div>
      )}

      {status === 'success' && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-success-bg)', borderRadius: 'var(--radius-md)' }}>
            <div style={{ color: 'var(--color-success)' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-success">Payment Successful</p>
              <p className="text-xs text-secondary">Successfully sent {amount} XLM</p>
            </div>
          </div>

          <div className="flex flex-col gap-3 text-sm">
            <div className="flex justify-between items-center py-2" style={{ borderBottom: '1px solid var(--color-border)' }}>
              <span className="text-secondary">Recipient</span>
              <span className="font-mono bg-bg-tertiary px-1 rounded">{recipient}</span>
            </div>
            
            <div className="flex justify-between items-center py-2">
              <span className="text-secondary">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs">{hash}</span>
                {hash && <CopyButton text={hash} />}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a 
              href={`https://stellar.expert/explorer/testnet/tx/${hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary w-full"
              style={{ width: '100%', textDecoration: 'none' }}
            >
              View on Stellar Explorer
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: '4px' }}>
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15 3 21 3 21 9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
            </a>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-start gap-3" style={{ padding: 'var(--space-3)', backgroundColor: 'var(--color-error-bg)', borderRadius: 'var(--radius-md)' }}>
          <div style={{ color: 'var(--color-error)', marginTop: '2px' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-error">Transaction Failed</p>
            <p className="text-xs text-secondary mt-1">{errorMessage || 'The transaction was rejected or failed on the network.'}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionStatus;
