import { useState, useCallback } from 'react';
import { checkFreighterInstallation, connectFreighter, getFreighterNetwork } from '../lib/freighter';

export const useWallet = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [network, setNetwork] = useState<string | null>(null);

  const connect = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const isInstalled = await checkFreighterInstallation();
      if (!isInstalled) {
        setError('Freighter is not installed.');
        return;
      }

      const connectedAddress = await connectFreighter();
      const currentNetwork = await getFreighterNetwork();
      
      setAddress(connectedAddress);
      setNetwork(currentNetwork);
      
      if (currentNetwork !== 'TESTNET') {
        setError('Please switch to the Testnet network in Freighter.');
      } else {
        setIsConnected(true);
      }
    } catch (err: any) {
      if (err?.message?.includes('User declined')) {
        setError('Connection request was declined. Please try again.');
      } else {
        setError(err?.message || 'Failed to connect to Freighter.');
      }
    } finally {
      setIsConnecting(false);
    }
  }, []);

  const disconnect = useCallback(() => {
    setIsConnected(false);
    setAddress('');
    setNetwork(null);
    setError(null);
  }, []);

  return {
    isConnected,
    address,
    network,
    error,
    isConnecting,
    connect,
    disconnect,
  };
};
