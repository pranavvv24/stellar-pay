import { useState, useCallback } from 'react';
import { TransactionBuilder, Asset, Operation } from '@stellar/stellar-sdk';
import { server, NETWORK_PASSPHRASE } from '../lib/stellar';
import { signTransactionWithFreighter } from '../lib/freighter';

export type TransactionState = 'idle' | 'awaiting_signature' | 'processing' | 'success' | 'error';

export const useTransaction = (senderAddress: string, isConnected: boolean) => {
  const [status, setStatus] = useState<TransactionState>('idle');
  const [error, setError] = useState<string | null>(null);
  const [txDetails, setTxDetails] = useState<{ amount: string, recipient: string, hash: string } | null>(null);

  const buildAndSignTransaction = useCallback(async (recipientAddress: string, amount: string) => {
    if (!isConnected || !senderAddress) {
      setError('Wallet is not connected');
      setStatus('error');
      return null;
    }

    setStatus('awaiting_signature');
    setError(null);
    setTxDetails(null);
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
      
      setStatus('processing');

      // Submit transaction
      const transactionToSubmit = TransactionBuilder.fromXdr(signedXdr, NETWORK_PASSPHRASE);
      const response = await server.submitTransaction(transactionToSubmit as any);
      
      console.log('Transaction success! Hash:', response.hash);

      setTxDetails({
        amount,
        recipient: recipientAddress,
        hash: response.hash,
      });
      setStatus('success');
      
      return response;
    } catch (err: any) {
      console.error('Error in transaction flow:', err);
      if (err?.message?.includes('User declined') || err?.message?.includes('cancelled')) {
        setError('Transaction cancelled by user.');
      } else if (err?.response?.data?.extras?.result_codes) {
        // Handle Stellar network error codes
        const resultCodes = err.response.data.extras.result_codes;
        const txCode = resultCodes.transaction;
        const opCodes = resultCodes.operations || [];
        
        if (txCode === 'tx_insufficient_balance') {
          setError("You don't have enough XLM to pay the network fee for this transaction.");
        } else if (txCode === 'tx_bad_seq') {
          setError("Transaction sequence error. Please wait a moment and try again.");
        } else if (opCodes.includes('op_no_destination')) {
          setError("The destination account doesn't exist on the network. It must be funded with a minimum balance first.");
        } else if (opCodes.includes('op_underfunded')) {
          setError("You don't have enough XLM to send this amount and maintain your account's minimum balance.");
        } else if (opCodes.includes('op_low_reserve')) {
          setError("The destination account doesn't have enough XLM to satisfy the minimum reserve requirements.");
        } else {
          setError(`Transaction rejected by network (${txCode}).`);
        }
      } else {
        setError(err?.message || 'A network error occurred while submitting the transaction.');
      }
      setStatus('error');
      return null;
    }
  }, [senderAddress, isConnected]);

  return { status, error, txDetails, buildAndSignTransaction };
};
