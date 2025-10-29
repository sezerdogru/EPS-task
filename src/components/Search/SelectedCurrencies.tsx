"use client";

import dynamic from "next/dynamic";
import { useCurrencyList } from "@/hooks/useCurrencyList";
import { useMemo } from "react";
import makeAnimated from "react-select/animated";
import { useSelectedCurrencies } from "@/context/SelectedCurrenciesContext";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function SelectedCurrencies() {
  const { data: currencies, isLoading } = useCurrencyList();
  const { selectedCurrencies, handleChange } = useSelectedCurrencies();
  const animatedComponents = makeAnimated();

  const options: Option[] = useMemo(() => {
    if (!currencies) return [];
    return Object.entries(currencies).map(([code, name]) => ({
      value: code,
      label: name as string,
    }));
  }, [currencies]);

  const selectedOptions: Option[] = useMemo(
    () =>
      options.filter((o: Option) =>
        selectedCurrencies.some((sel: Option) => sel.value === o.value)
      ),
    [options, selectedCurrencies]
  );

  return (
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
        value={selectedOptions}
        isLoading={isLoading}
        placeholder={`Select currency...`}
        instanceId="currency-select-box"
      />
    </div>
  );
}
