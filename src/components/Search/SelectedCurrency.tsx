"use client";

import dynamic from "next/dynamic";
import { useCurrencyList } from "@/hooks/useCurrencyList";
import { useMemo } from "react";
import { useBaseCurrency } from "@/context/BaseCurrencyContext";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function SelectedCurrency() {
  const { data: currencies, isLoading, error } = useCurrencyList();
  const { selectedCurrency, setSelectedCurrency } = useBaseCurrency();

  const options: Option[] = useMemo(() => {
    if (!currencies) return [];
    return Object.entries(currencies).map(([code, name]) => ({
      value: code,
      label: name,
    }));
  }, [currencies]);

  const selectedCurrencyOption: Option | null = useMemo(
    () =>
      options.find(
        (o: Option) => o.value.toLowerCase() === selectedCurrency.toLowerCase()
      ) || null,
    [options, selectedCurrency]
  );
  return (
    <div className="flex flex-col gap-6">
      <span className="text-xl font-bold">
        Base currency: {selectedCurrencyOption?.label.toUpperCase()}
      </span>
      <Select
        id="filter"
        isSearchable
        isClearable={false}
        required
        value={selectedCurrencyOption}
        captureMenuScroll
        onChange={(newValue: unknown) =>
          setSelectedCurrency((newValue as Option).value)
        }
        isLoading={isLoading}
        options={options}
        placeholder={
          error ? "Error loading currencies..." : "Select currency..."
        }
        instanceId="currency-select-box"
        isDisabled={isLoading}
      />
    </div>
  );
}
