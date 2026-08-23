import React, { useState, useEffect } from 'react';
import CopyButton from './CopyButton';
import { checkFreighterInstallation } from '../lib/freighter';

interface WalletCardProps {
  isConnected: boolean;
  address: string;
  balance: string;
  isLoading: boolean;
  onConnect?: () => void;
  onDisconnect?: () => void;
  isConnecting?: boolean;
  error?: string | null;
}

const WalletCard: React.FC<WalletCardProps> = ({ 
  isConnected, 
  address, 
  balance, 
  isLoading,
  onConnect,
  onDisconnect,
  isConnecting,
  error
}) => {
  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean | null>(null);

  useEffect(() => {
    const checkInstallation = async () => {
      const installed = await checkFreighterInstallation();
      setIsFreighterInstalled(installed);
    };
    checkInstallation();
  }, []);

  if (!isConnected) {
    return (
      <div className="card flex flex-col items-center justify-center gap-4" style={{ padding: 'var(--space-10)' }}>
        {isFreighterInstalled === false ? (
          <>
            <div className="text-center">
              <h2 className="text-lg font-medium mb-1">Freighter Not Found</h2>
              <p className="text-sm text-secondary">Please install the Freighter browser extension to continue.</p>
            </div>
            <a 
              href="https://www.freighter.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary" 
              style={{ padding: 'var(--space-3) var(--space-6)', textDecoration: 'none' }}
            >
              Install Freighter
            </a>
          </>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-lg font-medium mb-1">Connect your wallet</h2>
              <p className="text-sm text-secondary">Connect Freighter to view your balance and send payments.</p>
            </div>
            
            {error && (
              <div className="text-error text-sm text-center mb-2 p-2 bg-error-light rounded" style={{ backgroundColor: 'rgba(255, 77, 79, 0.1)' }}>
                {error}
              </div>
            )}
            
            <button 
              className="btn btn-primary" 
              style={{ padding: 'var(--space-3) var(--space-6)' }}
              disabled={isFreighterInstalled === null || isConnecting}
              onClick={onConnect}
            >
              {isConnecting ? 'Connecting...' : 'Connect Freighter'}
            </button>
          </>
        )}
      </div>
    );
  }

  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '';

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
        <button 
          className="btn btn-ghost text-error"
          onClick={onDisconnect}
          title="Clear the current app session"
        >
          Disconnect Session
        </button>
      </div>
    </div>
  );
};

export default WalletCard;
