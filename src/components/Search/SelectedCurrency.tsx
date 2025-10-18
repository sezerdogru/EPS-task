"use client";

import dynamic from "next/dynamic"; 
import useSearchHook from "@/hooks/useSearchHook";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function SelectedCurrency() {
  const {
    selectedOption,
    handleBaseCurrencyChange,
    isCurrenciesLoading,
    isError,
    rates,
  } = useSearchHook();

  return (
    <div className="flex flex-col gap-6">
      <span className="text-xl font-bold">
        Base currency: {selectedOption?.label.toUpperCase()}
      </span>
      <Select
        id="filter"
        isSearchable
        isClearable={false}
        required
        value={selectedOption}
        captureMenuScroll
        onChange={(newValue: unknown) =>
          handleBaseCurrencyChange(newValue as Option)
        }
        isLoading={isCurrenciesLoading}
        options={rates}
        placeholder={
          isError ? "Error loading currencies..." : "Select currency..."
        }
        instanceId="currency-select-box"
        isDisabled={isError}
      />
    </div>
  );
}
