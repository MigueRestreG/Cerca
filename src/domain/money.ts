export type CurrencyCode = 'MXN' | 'USD' | 'BRL' | 'COP' | 'EUR';

export interface Money {
  readonly amountMinor: number; // 129990 never float
  readonly currency: CurrencyCode;
}

// Digits after decimal point for each currency
const MINOR_UNIT_DIGITS: Record<CurrencyCode, number> = {
  MXN: 2,
  USD: 2,
  BRL: 2,
  COP: 2,
  EUR: 2,
};

export function minorUnitDigits(currency: CurrencyCode): number {
  return MINOR_UNIT_DIGITS[currency] ?? 2;
}

export function formatMoney(money: Money, locale: string): string {
  const digits = minorUnitDigits(money.currency);
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
  }).format(money.amountMinor / 10 ** digits);
}
