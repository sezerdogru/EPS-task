"use client";

import { useQuery } from "@tanstack/react-query";

async function fetchCurrencyList(): Promise<Record<string, string>> {
  const res = await fetch(
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
  );
  if (!res.ok) throw new Error("Failed to fetch currencies");
  return res.json();
}

export function useCurrencyList() {
  return useQuery<Record<string, string>>({
    queryKey: ["currencyList"],
    queryFn: fetchCurrencyList,
    staleTime: Infinity,
    gcTime: Infinity,
  });
}
