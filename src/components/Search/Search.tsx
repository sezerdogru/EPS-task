"use client";

import CustomDatepicker from "../CustomDatepicker";
import SelectedCurrency from "./SelectedCurrency";
import SelectedCurrencies from "./SelectedCurrencies";
import Table from "@/components/Table";
import { useRates } from "@/hooks/useRates";
import { useBaseCurrency } from "@/context/BaseCurrencyContext";
import { useDateContext } from "@/context/DateContext";
import { useSelectedCurrencies } from "@/context/SelectedCurrenciesContext";

export default function Search() {
  const { selectedCurrency } = useBaseCurrency();
  const { date } = useDateContext();
  const { selectedCurrencies } = useSelectedCurrencies();

  const { data, isLoading, refetch } = useRates(
    selectedCurrency,
    date,
    selectedCurrencies
  );

  const handleSearchClick = () => {
    refetch();
  };

  return (
    <>
      <div className="flex gap-2 flex-col w-full border border-gray-400 rounded-lg p-2">
        <div className="grid grid-cols-2 gap-4 p-4">
          <SelectedCurrency />
          <CustomDatepicker />
        </div>
        <div className="flex gap-4 p-4 justify-between">
          <SelectedCurrencies />
          <button
            className="self-end px-6 py-2 rounded-lg bg-blue-200 disabled:bg-gray-500"
            onClick={handleSearchClick}
            disabled={isLoading}
          >
            Search
          </button>
        </div>
      </div>
      <Table data={data} isLoading={isLoading} />
    </>
  );
}
