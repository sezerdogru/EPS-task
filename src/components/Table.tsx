"use client";

import TableRow from "./TableRow";
import { useCurrencyRates } from "../context/CurrencyContext";
import { useMemo } from "react";

const Table = () => {
  const { rates, isPending } = useCurrencyRates();

  if (isPending || !rates.length) {
    return <div>Loading...</div>;
  }

  const fields = useMemo(
    () =>
      Object.keys(
        rates[0].rates.reduce((acc, cur) => ({ ...acc, ...cur }), {})
      ),
    [rates]
  );

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
