"use client";

import { useCurrencyRates } from "@/context/CurrencyContext";
import useFetchCurrencies from "@/hooks/useFetchCurrencies";
import { ActionMeta } from "react-select";
import makeAnimated from "react-select/animated";
import { useMemo } from "react";

export default function useSearchHook() {
  const {
    selectedCurrency,
    selectedCurrencies,
    refetch,
    setSelectedCurrencies,
    setSelectedCurrency,
    isFetching,
    date,
  } = useCurrencyRates();

  const { currencies } = useFetchCurrencies();

  const options: Option[] = useMemo(
    () =>
      currencies
        ? Object.entries(currencies).map(([code, name]) => ({
            value: code,
            label: `${name}`,
          }))
        : [],
    [currencies]
  );

  const selectedOption = useMemo(
    () => options.find((o) => o.value === selectedCurrency) || null,
    [options, selectedCurrency]
  );

  const animatedComponents = makeAnimated();

  const handleChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    const valueArray = newValue as Option[];

    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (valueArray.length < 3) {
          alert("List must consist of min 3 elements!");
          return;
        }
        break;

      case "clear":
        alert("Cannot clear all items, minimum 3 required!");
        return;
    }

    if (valueArray.length > 7) {
      alert("List must consist of max 7 elements!");
      return;
    }

    setSelectedCurrencies(newValue as Option[]);
  };

  return {
    options,
    selectedOption,
    selectedCurrency,
    animatedComponents,
    setSelectedCurrency,
    isFetching,
    refetch,
    selectedCurrencies,
    handleChange,
    date,
  };
}
