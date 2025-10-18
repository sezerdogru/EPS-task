"use client";

import { ActionMeta } from "react-select";
import dynamic from "next/dynamic";
import CustomDatepicker from "./CustomDatepicker";
import { daysSince } from "@/utils/dateUtils";
import useSearchHook from "@/hooks/useSearchHook";

const Select = dynamic(() => import("react-select"), {
  ssr: false,
});

export default function Search() {
  const {
    options,
    selectedOption,
    selectedCurrency,
    animatedComponents,
    setSelectedCurrency,
    refetch,
    selectedCurrencies,
    handleChange,
    isFetching,
    date,
  } = useSearchHook();

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
          <span className="text-xl font-bold">Last {daysSince(date)} days</span>
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
          disabled={isFetching}
        >
          Search
        </button>
      </div>
    </div>
  );
}
