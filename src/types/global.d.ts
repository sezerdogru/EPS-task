declare global {
  type CurrencyData = {
    [code: string]: number;
  };

  type RatesData = {
    date: string;
    [baseCurrency: string]: CurrencyData;
  };

  type RatesLoopData = {
    date: string;
    rates: CurrencyData[];
  };
}

export {};
