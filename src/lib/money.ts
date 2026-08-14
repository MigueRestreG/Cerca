export type MoneyLike = {
  amountMinor: number;
  currency: string;
};

const minorUnits: Record<string, number> = {
  CLP: 0,
  COP: 0,
  IDR: 0,
  JPY: 0,
  KRW: 0,
  PYG: 0,
  VND: 0,
};

export function minorUnitDigits(currency: string) {
  return minorUnits[currency.toUpperCase()] ?? 2;
}

export function formatMoney(money: MoneyLike, locale: string) {
  const digits = minorUnitDigits(money.currency);

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: money.currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(money.amountMinor / 10 ** digits);
}