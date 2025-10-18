"use client";

import { ActionMeta } from "react-select";
import makeAnimated from "react-select/animated";
import {
  setSelectedCurrency,
  setSelectedCurrencies,
} from "@/store/slices/filterSlice";
import { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/store";
import { useGetAllCurrenciesQuery } from "@/api/currencyApi";

export default function useSearchHook() {
  const dispatch = useAppDispatch();

  const selectedCurrency = useAppSelector(
    (state) => state.filters.selectedCurrency
  );
  const selectedCurrencies = useAppSelector(
    (state) => state.filters.selectedCurrencies
  );

  const {
    data: rates,
    isLoading: isCurrenciesLoading,
    isError,
  } = useGetAllCurrenciesQuery(undefined, {
    selectFromResult: ({ data, ...rest }) => ({
      ...rest,
      data: data
        ? Object.entries(data).map(([code, name]) => ({
            value: code,
            label: name,
          }))
        : [],
    }),
  });

  const selectedOption = useMemo(
    () => rates.find((o) => o.value === selectedCurrency) || null,
    [rates, selectedCurrency]
  );

  const selectedOptions = useMemo(
    () =>
      rates.filter((o) =>
        selectedCurrencies.some((sel) => sel.value === o.value)
      ),
    [rates, selectedCurrencies]
  );

  const animatedComponents = makeAnimated();

  const handleBaseCurrencyChange = (newValue: unknown) => {
    dispatch(setSelectedCurrency((newValue as Option)?.value));
  };

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

    dispatch(setSelectedCurrencies(newValue as Option[]));
  };

  return {
    rates,
    selectedOption,
    selectedOptions,
    selectedCurrency,
    selectedCurrencies,
    animatedComponents,
    handleBaseCurrencyChange,
    handleChange,
    isCurrenciesLoading,
    isError,
  };
}
