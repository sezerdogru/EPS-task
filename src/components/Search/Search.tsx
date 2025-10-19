"use client";

import CustomDatepicker from "../CustomDatepicker";

import { useAppDispatch, useAppSelector } from "@/store/store";
import { triggerSearch } from "@/store/slices/filterSlice";
import { useLazyGetRatesQuery } from "@/api/currencyApi";
import { daysSince } from "@/utils/dateUtils";
import SelectedCurrency from "./SelectedCurrency";
import Selectedcurrencies from "./SelectedCurrencies";

import { setRatesData, setFetchingState } from "@/store/slices/filterSlice";
import { useEffect } from "react";

export default function Search() {
  const dispatch = useAppDispatch();

  const { selectedCurrency, date } = useAppSelector((state) => state.filters);

  const [triggerFetch, { data: ratesData, isFetching, isSuccess }] =
    useLazyGetRatesQuery();

  useEffect(() => {
    dispatch(triggerSearch());
    triggerFetch({ base: selectedCurrency, date });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(setFetchingState(isFetching));

    if (isSuccess && ratesData) {
      dispatch(setRatesData(ratesData));
    }
  }, [isFetching, isSuccess, ratesData, dispatch]);

  const handleSearchClick = () => {
    dispatch(triggerSearch());
    triggerFetch({ base: selectedCurrency, date });
  };

  return (
    <div className="flex gap-2 flex-col w-full border border-gray-400 rounded-lg p-2">
      <div className="grid grid-cols-2 gap-4 p-4">
        <SelectedCurrency />
        <div className="flex flex-col gap-6">
          <span className="text-xl font-bold">Last {daysSince(date)} days</span>
          <CustomDatepicker />
        </div>
      </div>
      <div className="flex gap-4 p-4 justify-between">
        <Selectedcurrencies />
        <button
          className="self-end px-6 py-2 rounded-lg bg-blue-200"
          onClick={handleSearchClick}
          disabled={isFetching}
        >
          Search
        </button>
      </div>
    </div>
  );
}
