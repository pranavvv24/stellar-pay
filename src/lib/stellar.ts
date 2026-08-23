import { Horizon } from '@stellar/stellar-sdk';

export const TESTNET_URL = 'https://horizon-testnet.stellar.org';
export const NETWORK_PASSPHRASE = 'Test SDF Network ; September 2015';

export const server = new Horizon.Server(TESTNET_URL);
