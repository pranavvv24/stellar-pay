import React from 'react';
import CopyButton from './CopyButton';

interface WalletCardProps {
  isConnected: boolean;
  address: string;
  balance: string;
  isLoading: boolean;
}

const WalletCard: React.FC<WalletCardProps> = ({ isConnected, address, balance, isLoading }) => {
  if (!isConnected) {
    return (
      <div className="card flex flex-col items-center justify-center gap-4" style={{ padding: 'var(--space-10)' }}>
        <div className="text-center">
          <h2 className="text-lg font-medium mb-1">Connect your wallet</h2>
          <p className="text-sm text-secondary">Connect Freighter to view your balance and send payments.</p>
        </div>
        <button className="btn btn-primary" style={{ padding: 'var(--space-3) var(--space-6)' }}>
          Connect Freighter
        </button>
      </div>
    );
  }

  const shortenedAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;

  return (
    <div className="card flex flex-col gap-6">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <span className="text-sm text-secondary font-medium">Wallet Address</span>
          <div className="flex items-center gap-2">
            <span className="text-base font-mono bg-bg-tertiary" style={{ backgroundColor: 'var(--color-bg-tertiary)', padding: '2px 6px', borderRadius: 'var(--radius-sm)' }}>
              {shortenedAddress}
            </span>
            <CopyButton text={address} />
          </div>
        </div>
        <span className="badge badge-testnet">Stellar Testnet</span>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm text-secondary font-medium">Available Balance</span>
        {isLoading ? (
          <div className="skeleton" style={{ height: '48px', width: '200px' }} />
        ) : (
          <div className="flex items-baseline gap-2">
            <span className="text-3xl">{balance}</span>
            <span className="text-lg text-secondary font-medium">XLM</span>
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2" style={{ borderTop: '1px solid var(--color-border)' }}>
        <button className="btn btn-ghost text-error">Disconnect</button>
      </div>
    </div>
  );
};

export default WalletCard;
