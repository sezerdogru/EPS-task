declare global {
  type CurrencyType = {
    [code: string]: number;
  };

  type RatesType = {
    date: string;
    [baseCurrency: string]: CurrencyData;
  };

  type TransformedRatesType = {
    date: string;
    rates: CurrencyData[];
  };

  type Option = {
    value: string;
    label: string;
  };
}

export {};
