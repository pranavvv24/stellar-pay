import { useState, useCallback } from 'react';
import { TransactionBuilder, Asset, Operation } from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from '../lib/stellar';
import { signTransactionWithFreighter } from '../lib/freighter';

export type TransactionState = 'idle' | 'awaiting_signature' | 'processing' | 'success' | 'error';

export const useTransaction = (senderAddress: string, isConnected: boolean) => {
  const [status, setStatus] = useState<TransactionState>('idle');
  const [error, setError] = useState<string | null>(null);

  const buildAndSignTransaction = useCallback(async (recipientAddress: string, amount: string) => {
    if (!isConnected || !senderAddress) {
      setError('Wallet is not connected');
      setStatus('error');
      return null;
    }

    setStatus('awaiting_signature');
    setError(null);
    try {
      const sourceAccount = await server.loadAccount(senderAddress);
      const fee = await server.fetchBaseFee();
      
      const transaction = new TransactionBuilder(sourceAccount, {
        fee: fee.toString(),
        networkPassphrase: NETWORK_PASSPHRASE,
      })
      .addOperation(
        Operation.payment({
          destination: recipientAddress,
          asset: Asset.native(),
          amount: amount,
        })
      )
      .setTimeout(180)
      .build();

      // Sign with Freighter
      const signedXdr = await signTransactionWithFreighter(transaction.toXdr(), NETWORK_PASSPHRASE);
      console.log('Signed XDR:', signedXdr);
      
      // We will submit this later. For now, just mark it success or processing
      setStatus('success'); // Temp success for this step
      
      return signedXdr;
    } catch (err: any) {
      console.error('Error in transaction flow:', err);
      if (err?.message?.includes('User declined') || err?.message?.includes('cancelled')) {
        setError('Transaction cancelled');
      } else {
        setError(err?.message || 'Failed to process transaction');
      }
      setStatus('error');
      return null;
    }
  }, [senderAddress, isConnected]);

  return { status, error, buildAndSignTransaction };
};
