import { Currency } from '../types/currency.enum';

export const getStringFromCurrency = (currency: Currency): string => {
  switch (currency) {
    case Currency.EUR:
      return 'EUR';
  }
};

export const getCurrencyFromString = (
  currencyString: string,
): Currency | null => {
  if (currencyString === 'EUR') {
    return Currency.EUR;
  }
  return null;
};
