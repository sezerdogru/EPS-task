"use client";

import TableRow from "./TableRow";
import { useCurrencyRates } from "../context/CurrencyContext";
import { useMemo } from "react";

const Table = () => {
  const { rates, isPending, isFetching } = useCurrencyRates();

  const fields = useMemo(() => {
    if (!rates || rates.length === 0) return [];
    return Object.keys(
      rates[0].rates.reduce((acc, cur) => ({ ...acc, ...cur }), {})
    );
  }, [rates]);

  if (isPending || isFetching || !rates.length) {
    return <div>Loading...</div>;
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
