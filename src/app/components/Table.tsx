"use client";

import TableRow from "./TableRow";
import useFetchCurrencyRates from "../hooks/useFetchCurrencyRates";

export const Table = () => {
  const { currencyList, rates, isPending } = useFetchCurrencyRates();

  if (isPending || !rates.length) {
    return <div>Loading...</div>;
  }

  return (
    <table className="table-auto border-collapse border border-slate-400">
      <thead>
        <tr>
          <th className="border border-slate-300 px-4 py-2">
            <span className="uppercase">DAY</span>
          </th>
          {currencyList.map((currency: string) => (
            <th key={currency} className="border border-slate-300 px-4 py-2">
              <span className="uppercase"> {currency}</span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rates.map((rate: RatesLoopData) => (
          <TableRow key={rate.date} rate={rate} currencyList={currencyList} />
        ))}
      </tbody>
    </table>
  );
};
