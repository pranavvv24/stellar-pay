import Header from './components/Header';
import WalletCard from './components/WalletCard';
import PaymentForm from './components/PaymentForm';
import TransactionStatus from './components/TransactionStatus';
import { useWallet } from './hooks/useWallet';

function App() {
  const { isConnected, address, error, isConnecting, connect, disconnect } = useWallet();

  // Dummy state for UI building (balance)
  const balance = '0.00';
  const isLoadingBalance = false;

  return (
    <div className="app-container">
      <Header isConnected={isConnected} />
      
      <main className="main-content">
        <WalletCard 
          isConnected={isConnected} 
          address={address} 
          balance={balance} 
          isLoading={isLoadingBalance}
          onConnect={connect}
          onDisconnect={disconnect}
          isConnecting={isConnecting}
          error={error}
        />
        
        <PaymentForm availableBalance={balance} />
        
        <TransactionStatus 
          status="success" // change to 'idle', 'processing', 'success', 'error' for testing
          amount="50.00"
          recipient="GB2V4..."
          hash="3a5f9c...8b2d1"
        />
      </main>
    </div>
  );
}

export default App;
