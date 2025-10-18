"use client";

import { useAppSelector } from "@/store/store";
import TableRow from "./TableRow";
import { useMemo } from "react";

const Table = () => {
  const rates = useAppSelector((state) => state.filters.rates);
  const isFetching = useAppSelector(
    (state) => state.filters.searchParams.isFetching
  );

  const fields = useMemo(() => {
    if (!rates || rates.length === 0) return [];
    return Object.keys(
      rates[0].rates.reduce((acc, cur) => ({ ...acc, ...cur }), {})
    );
  }, [rates]);

  if (isFetching) {
    return <div>Loading...</div>;
  }

  if (!rates?.length) {
    return <div>No data</div>;
  }

  return (
    <table className="table-auto border-collapse border border-slate-400 w-full">
      <thead>
        <tr>
          <th className="border border-slate-300 px-4 py-2">
            <span className="uppercase">DAY</span>
          </th>
          {fields.map((currencyCode: string) => (
            <th
              key={currencyCode}
              className="border border-slate-300 px-4 py-2"
            >
              <span className="uppercase">{currencyCode}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rates.map((rate: RatesLoopData) => (
          <TableRow key={rate.date} rate={rate} currencyList={fields} />
        ))}
      </tbody>
    </table>
  );
};

export default Table;
