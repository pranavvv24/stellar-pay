import { useState, useCallback, useEffect } from 'react';
import { server } from '../lib/stellar';

export const useBalance = (address: string, isConnected: boolean) => {
  const [balance, setBalance] = useState('0.00');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBalance = useCallback(async () => {
    if (!address || !isConnected) {
      setBalance('0.00');
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const account = await server.loadAccount(address);
      const nativeBalance = account.balances.find((b: any) => b.asset_type === 'native');
      setBalance(nativeBalance ? nativeBalance.balance : '0.00');
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setError('Account not yet funded on Testnet.');
      } else {
        setError(err?.message || 'Failed to fetch balance');
      }
      setBalance('0.00');
    } finally {
      setIsLoading(false);
    }
  }, [address, isConnected]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { balance, isLoading, error, fetchBalance };
};
