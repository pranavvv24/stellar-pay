import React from 'react';

interface HeaderProps {
  isConnected: boolean;
}

const Header: React.FC<HeaderProps> = ({ isConnected }) => {
  return (
    <header className="flex justify-between items-center" style={{ paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--color-border)' }}>
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-semibold">StellarPay</h1>
        <span className="badge badge-testnet">TESTNET</span>
      </div>
      
      <div className="flex items-center gap-4 header-actions">
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-secondary"
          style={{ textDecoration: 'none' }}
        >
          GitHub
        </a>
        <div className="flex items-center gap-2">
          <div 
            style={{ 
              width: 8, 
              height: 8, 
              borderRadius: '50%', 
              backgroundColor: isConnected ? 'var(--color-success)' : 'var(--color-text-tertiary)' 
            }} 
          />
          <span className="text-sm text-secondary">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
