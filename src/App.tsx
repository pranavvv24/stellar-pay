import Header from './components/Header';
import WalletCard from './components/WalletCard';
import PaymentForm from './components/PaymentForm';
import TransactionStatus from './components/TransactionStatus';
import { useWallet } from './hooks/useWallet';
import { useBalance } from './hooks/useBalance';
import { useTransaction } from './hooks/useTransaction';

function App() {
  const { isConnected, address, error: walletError, isConnecting, connect, disconnect } = useWallet();
  const { balance, isLoading: isLoadingBalance, error: balanceError } = useBalance(address, isConnected);
  
  const { status: txStatus, error: txError, buildAndSignTransaction } = useTransaction(address, isConnected);

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
          error={walletError}
          balanceError={balanceError}
        />
        
        <PaymentForm 
          availableBalance={balance} 
          onSendPayment={buildAndSignTransaction}
          isProcessing={txStatus === 'awaiting_signature' || txStatus === 'processing'}
        />
        
        <TransactionStatus 
          status={txStatus}
          errorMessage={txError || undefined}
        />
      </main>
    </div>
  );
}

export default App;
