import { isConnected, requestAccess, getNetworkDetails, setAllowed, signTransaction } from '@stellar/freighter-api';

/**
 * Checks whether the Freighter extension is installed and available.
 */
export const checkFreighterInstallation = async (): Promise<boolean> => {
  try {
    const response = await isConnected();
    return response.isConnected;
  } catch (error) {
    console.error('Error checking Freighter installation:', error);
    return false;
  }
};

/**
 * Requests connection to Freighter and gets the user's public address.
 */
export const connectFreighter = async (): Promise<string> => {
  const allowedResponse = await setAllowed();
  if (allowedResponse.error) {
    throw new Error(allowedResponse.error);
  }
  if (!allowedResponse.isAllowed) {
    throw new Error('User declined access to Freighter');
  }

  const accessResponse = await requestAccess();
  if (accessResponse.error) {
    throw new Error(accessResponse.error);
  }
  
  return accessResponse.address;
};

/**
 * Gets the current network Freighter is set to.
 */
export const getFreighterNetwork = async (): Promise<string> => {
  const networkResponse = await getNetworkDetails();
  if (networkResponse.error) {
    throw new Error(networkResponse.error);
  }
  
  return networkResponse.network;
};

/**
 * Passes a built transaction XDR to Freighter for signing.
 */
export const signTransactionWithFreighter = async (transactionXdr: string, networkPassphrase: string): Promise<string> => {
  const signResponse = await signTransaction(transactionXdr, {
    networkPassphrase,
  });

  if (signResponse.error) {
    throw new Error(signResponse.error as string);
  }

  return signResponse.signedTxXdr;
};
