"use client";

import { useCurrencyRates } from "@/context/CurrencyContext";
import useFetchCurrencies from "@/hooks/useFetchCurrencies";
import { ActionMeta } from "react-select";
import makeAnimated from "react-select/animated";
import { useMemo } from "react";
import dynamic from "next/dynamic";
import CustomDatepicker from "./CustomDatepicker";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

interface Option {
  value: string;
  label: string;
}

export default function Search() {
  const {
    selectedCurrency,
    selectedCurrencies,
    refetch,
    setSelectedCurrencies,
    setSelectedCurrency,
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

  return (
    <div className="flex gap-2 flex-col w-full border border-gray-400 rounded-lg p-2">
      <div className="grid grid-cols-2 gap-4 p-4">
        <div className="flex flex-col gap-6">
          <span className="text-xl font-bold">
            Current currency: {selectedCurrency}
          </span>
          <Select
            id="filter"
            isSearchable
            isClearable
            required
            value={selectedOption}
            captureMenuScroll
            onChange={(newValue: unknown, actionMeta: ActionMeta<unknown>) =>
              setSelectedCurrency((newValue as Option)?.value)
            }
            options={options}
            placeholder={`Select currency...`}
            instanceId="currency-select-box"
          />
        </div>
        <div className="flex flex-col gap-6">
          <span className="text-xl font-bold">Date: {date}</span>

          <CustomDatepicker />
        </div>
      </div>
      <div className="flex gap-4 p-4 justify-between">
        <div className="flex flex-col gap-6">
          <span className="text-xl font-bold">Selected Currencies</span>
          <Select
            id="filter"
            isSearchable
            isClearable
            isMulti
            required
            closeMenuOnSelect={false}
            captureMenuScroll
            onChange={handleChange}
            components={animatedComponents}
            options={options}
            value={selectedCurrencies}
            placeholder={`Select currency...`}
            instanceId="currency-select-box"
          />
        </div>
        <button
          className="self-end px-6 py-2 rounded-lg bg-blue-200"
          onClick={refetch}
        >
          Search
        </button>
      </div>
    </div>
  );
}
