"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useTransition,
  ReactNode,
  useRef,
} from "react";
import toast from "react-hot-toast";

const DEFAULT_CURRENCY_LIST = [
  { value: "usd", label: "US Dollar" },
  { value: "eur", label: "Euro" },
  { value: "jpy", label: "Japanese Yen" },
  { value: "chf", label: "Swiss Franc" },
  { value: "cad", label: "Canadian Dollar" },
  { value: "aud", label: "Australian Dollar" },
  { value: "zar", label: "South African Rand" },
];

interface CurrencyRatesContextValue {
  rates: RatesLoopData[];
  selectedCurrencies: CurrencyItemProps[];
  selectedCurrency: string;
  date: string;
  error: string | null;
  isPending: boolean;
  isFetching: boolean;

  refetch: () => Promise<void>;
  setSelectedCurrency: (currency: string) => void;
  setSelectedCurrencies: (list: CurrencyItemProps[]) => void;
  setDate: (date: string) => void;
}

const CurrencyRatesContext = createContext<
  CurrencyRatesContextValue | undefined
>(undefined);

const calculateInitialDate = () => {
  const today = new Date();
  const sevenDaysAgo = new Date(today);
  sevenDaysAgo.setDate(today.getDate() - 7);
  return sevenDaysAgo.toISOString().split("T")[0];
};

export const CurrencyRatesProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const sevenDaysAgoString = calculateInitialDate();
  const [isFetching, setIsFetching] = useState(false);
  const [rates, setRates] = useState<RatesLoopData[]>([]);
  const [selectedCurrencies, setSelectedCurrencies] = useState<
    CurrencyItemProps[]
  >(DEFAULT_CURRENCY_LIST);
  const [selectedCurrency, setSelectedCurrency] = useState<string>("gbp");
  const [date, setDate] = useState<string>(sevenDaysAgoString);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasFetched = useRef(false);

  const sortRates = useCallback(
    (apiRates: RatesData[]) => {
      const sortedRates: RatesLoopData[] = apiRates
        .map((rate) => ({
          date: rate.date,
          rates: selectedCurrencies.map((currency: CurrencyItemProps) => ({
            [currency.value]:
              rate[selectedCurrency.toLowerCase()]?.[
                currency.value.toLowerCase()
              ] ?? null,
          })),
        }))
        .reverse();
      setRates(sortedRates);
    },
    [selectedCurrencies, selectedCurrency]
  );

  const refetch = useCallback(async () => {
    setError(null);
    setIsFetching(true);

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

      const allRates: PromiseSettledResult<RatesData>[] =
        await Promise.allSettled(
          dates.map(async (d): Promise<RatesData> => {
            const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${selectedCurrency}.json`;
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch for date ${d}`);
            const data: RatesData = await response.json();
            return data;
          })
        );

      const rejected = allRates.filter(
        (r): r is PromiseRejectedResult => r.status === "rejected"
      );

      if (rejected.length > 0) {
        const failedDates = rejected
          .map((r) => r.reason.message || r.reason)
          .join(", ");
        toast.error(failedDates);
      }

      const successfulRates: RatesData[] = allRates
        .filter(
          (r): r is PromiseFulfilledResult<RatesData> =>
            r.status === "fulfilled"
        )
        .map((r) => r.value);

      startTransition(() => {
        sortRates(successfulRates);
      });
    } catch (error: unknown) {
      if (error instanceof Error) setError(error.message);
      else setError(String(error));
    } finally {
      setIsFetching(false);
    }
  }, [date, selectedCurrency, sortRates]);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    refetch();
  }, [refetch]);

  const contextValue: CurrencyRatesContextValue = {
    rates,
    selectedCurrencies,
    selectedCurrency,
    date,
    error,
    isPending,
    isFetching,
    refetch,
    setSelectedCurrency,
    setSelectedCurrencies,
    setDate,
  };

  return (
    <CurrencyRatesContext.Provider value={contextValue}>
      {children}
    </CurrencyRatesContext.Provider>
  );
};

export const useCurrencyRates = (): CurrencyRatesContextValue => {
  const context = useContext(CurrencyRatesContext);
  if (context === undefined) {
    throw new Error(
      "useCurrencyRates hook must be used within a CurrencyRatesProvider"
    );
  }
  return context;
};
