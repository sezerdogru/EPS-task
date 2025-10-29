"use client";

import { useQuery } from "@tanstack/react-query";
import { calculateDatesInRange, transformRatesData } from "@/utils/currency";
import toast from "react-hot-toast";

interface FetchRatesParams {
  selectedCurrency: string;
  date: string;
  selectedCurrencies: Option[];
}

const fetchRates = async ({
  selectedCurrency,
  date,
  selectedCurrencies,
}: FetchRatesParams): Promise<TransformedRatesType[]> => {
  const dates = calculateDatesInRange(date);

  try {
    const allRates = await Promise.allSettled(
      dates.map(async (d: string) => {
        const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${selectedCurrency}.json`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch for date ${d}`);
        }
        const data: RatesType = await response.json();
        return data;
      })
    );

    const rejected: PromiseRejectedResult[] = allRates.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );
    if (rejected.length > 0) {
      const failedDates = rejected
        .map((r: PromiseRejectedResult) => r.reason.message)
        .join(", ");
      toast.error(failedDates);
      throw new Error(`Failed to fetch: ${failedDates}`);
    }

    const successfulRates: RatesType[] = allRates
      .filter(
        (r): r is PromiseFulfilledResult<RatesType> => r.status === "fulfilled"
      )
      .map((r) => r.value);

    const transformedRates: TransformedRatesType[] = transformRatesData(
      successfulRates,
      selectedCurrency,
      selectedCurrencies
    );

    return transformedRates;
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    throw new Error(message);
  }
};

export function useRates(
  selectedCurrency: string,
  date: string,
  selectedCurrencies: Option[]
) {
  return useQuery<TransformedRatesType[]>({
    queryKey: ["rates"],
    queryFn: () => fetchRates({ selectedCurrency, date, selectedCurrencies }),
    enabled: true,
  });
}
