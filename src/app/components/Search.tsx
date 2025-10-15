"use client";

import useFetchCurrencyRates from "../hooks/useFetchCurrencyRates";

export default function Search() {
  const { currency, currencyList, date } = useFetchCurrencyRates();

  return (
    <div className="flex items-center gap-4 justify-center w-full flex-col">
      <span className="text-xl font-bold">Current currency: {currency}</span>
      <span className="text-xl font-bold">Date: {date}</span>
      <span className="text-xl font-bold">List: {currencyList.toString()}</span>
    </div>
  );
}
