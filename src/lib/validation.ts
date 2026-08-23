import { StrKey } from '@stellar/stellar-sdk';

export const isValidStellarAddress = (address: string): boolean => {
  if (!address) return false;
  return StrKey.isValidEd25519PublicKey(address);
};

export const validateAmount = (amount: string, availableBalance: string): string | null => {
  if (!amount) return null;

  const numericAmount = parseFloat(amount);
  if (isNaN(numericAmount) || numericAmount <= 0) {
    return 'Amount must be greater than zero';
  }

  const decimalParts = amount.split('.');
  if (decimalParts.length > 1 && decimalParts[1].length > 7) {
    return 'Amount cannot exceed 7 decimal places';
  }

  const numericBalance = parseFloat(availableBalance.replace(/,/g, ''));
  if (isNaN(numericBalance)) {
    return 'Invalid available balance';
  }

  if (numericAmount > numericBalance) {
    return 'Amount exceeds available balance';
  }

  return null;
};
