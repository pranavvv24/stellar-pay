import Header from './components/Header';
import WalletCard from './components/WalletCard';
import PaymentForm from './components/PaymentForm';
import TransactionStatus from './components/TransactionStatus';

function App() {
  // Dummy state for UI building
  const isConnected = true;
  const address = 'GA3D5KRYM6CB7OWQ6TWYRR3Z4T7GNZCV3CQIGIGG';
  const balance = '12,540.50';
  const isLoadingBalance = false; // toggle for skeleton

  return (
    <div className="app-container">
      <Header isConnected={isConnected} />
      
      <main className="main-content">
        <WalletCard 
          isConnected={isConnected} 
          address={address} 
          balance={balance} 
          isLoading={isLoadingBalance}
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
