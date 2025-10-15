import { useEffect, useTransition, useCallback, useState } from "react";

const DEFAULT_CURRENCY_LIST = ["USD", "EUR", "JPY", "CHF", "CAD", "AUD", "ZAR"];

export default function useFetchCurrencyRates() {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);

  const sevenDaysAgoString = sevenDaysAgo.toISOString().split("T")[0];

  const [rates, setRates] = useState<RatesLoopData[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currencies, setCurrencies] = useState<CurrencyData | null>(null);
  const [currencyList, setCurrencyList] = useState<string[]>(
    DEFAULT_CURRENCY_LIST
  );
  const [currency, setCurrency] = useState<string>("gbp");
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<string>(sevenDaysAgoString);
  const [error, setError] = useState<string | null>(null);

  const sortRates = useCallback(
    (rates: RatesData[]) => {
      const sortedRates = rates
        .map((rate) => ({
          date: rate.date,
          rates: currencyList.map((code) => ({
            [code]: rate[currency]?.[code.toLowerCase()] ?? null,
          })),
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
      setRates(sortedRates);
    },
    [currencyList, currency]
  );

  const fetchRates = useCallback(async () => {
    try {
      const startDate = new Date(date);
      const today = new Date();
      const dates: string[] = [];

      for (
        let d = new Date(startDate);
        d <= today;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(new Date(d).toISOString().split("T")[0]);
      }

      const allRates: RatesData[] = await Promise.all(
        dates.map(async (d) => {
          const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${currency}.json`;
          const response = await fetch(url);
          if (!response.ok) throw new Error("Failed to fetch currencies");
          const data: RatesData = await response.json();
          return data;
        })
      );

      startTransition(() => {
        sortRates(allRates);
      });

      console.log(allRates);
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError(String(error));
    }
  }, [date, currency, sortRates]);

  useEffect(() => {
    fetchRates();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    currencies,
    rates,
    currency,
    currencyList,
    date,
    setCurrencyList,
    setCurrency,
    error,
    isPending,
  };
}
