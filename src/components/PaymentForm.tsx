import React, { useState } from 'react';

interface PaymentFormProps {
  availableBalance: string;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ availableBalance }) => {
  const [address, setAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false); // Dummy state

  // Dummy validation
  const addressError = address.length > 0 && address.length < 56 ? 'Invalid Stellar address' : '';
  const amountError = amount && parseFloat(amount) <= 0 ? 'Amount must be greater than zero' : '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => setIsProcessing(false), 2000);
  };

  return (
    <form className="card flex flex-col gap-6" onSubmit={handleSubmit}>
      <div>
        <h2 className="text-lg font-medium mb-1">Send Payment</h2>
        <p className="text-sm text-secondary">Transfer XLM on the Testnet</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="form-group">
          <label htmlFor="address" className="form-label">Recipient Address</label>
          <input
            id="address"
            type="text"
            className="form-input"
            placeholder="G..."
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          {addressError && <span className="text-xs text-error">{addressError}</span>}
        </div>

        <div className="form-group">
          <div className="flex justify-between items-end mb-1">
            <label htmlFor="amount" className="form-label mb-0">Amount (XLM)</label>
            <span className="text-xs text-secondary">Available: {availableBalance} XLM</span>
          </div>
          <input
            id="amount"
            type="number"
            className="form-input"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.0000001"
            min="0"
          />
          {amountError && <span className="text-xs text-error">{amountError}</span>}
        </div>
      </div>

      <div className="pt-2">
        <button 
          type="submit" 
          className="btn btn-primary" 
          style={{ width: '100%', padding: 'var(--space-3)' }}
          disabled={!address || !amount || !!addressError || !!amountError || isProcessing}
        >
          {isProcessing ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
                <line x1="12" y1="2" x2="12" y2="6"></line>
                <line x1="12" y1="18" x2="12" y2="22"></line>
                <line x1="4.93" y1="4.93" x2="7.76" y2="7.76"></line>
                <line x1="16.24" y1="16.24" x2="19.07" y2="19.07"></line>
                <line x1="2" y1="12" x2="6" y2="12"></line>
                <line x1="18" y1="12" x2="22" y2="12"></line>
                <line x1="4.93" y1="19.07" x2="7.76" y2="16.24"></line>
                <line x1="16.24" y1="7.76" x2="19.07" y2="4.93"></line>
              </svg>
              Processing...
            </span>
          ) : (
            'Send XLM'
          )}
        </button>
        <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
      </div>
    </form>
  );
};

export default PaymentForm;
