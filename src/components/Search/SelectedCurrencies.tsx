"use client";

import dynamic from "next/dynamic";
import useSearchHook from "@/hooks/useSearchHook";

const Select = dynamic(() => import("react-select"), { ssr: false });

export default function Selectedcurrencies() {
  const {
    rates,
    selectedOptions,
    animatedComponents,
    handleChange,
    isCurrenciesLoading,
  } = useSearchHook();

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
        options={rates}
        value={selectedOptions}
        isLoading={isCurrenciesLoading}
        placeholder={`Select currency...`}
        instanceId="currency-select-box"
      />
    </div>
  );
}
