import { useState, useCallback } from 'react';
import { TransactionBuilder, Asset, Operation } from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from '../lib/stellar';

export const useTransaction = (senderAddress: string, isConnected: boolean) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const buildTransaction = useCallback(async (recipientAddress: string, amount: string) => {
    if (!isConnected || !senderAddress) {
      setError('Wallet is not connected');
      return null;
    }

    setIsProcessing(true);
    setError(null);
    try {
      // 1. Load the sender account to get its current sequence number
      const sourceAccount = await server.loadAccount(senderAddress);
      
      // 2. Fetch the current base fee from the network
      const fee = await server.fetchBaseFee();
      
      // 3. Build the transaction
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
      .setTimeout(180) // 3 minutes timeout
      .build();

      console.log('Unsigned Transaction Built:', transaction);
      console.log('Transaction XDR:', transaction.toXdr());
      return transaction;
    } catch (err: any) {
      console.error('Error building transaction:', err);
      setError(err?.message || 'Failed to build transaction');
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [senderAddress, isConnected]);

  return { isProcessing, error, buildTransaction };
};
