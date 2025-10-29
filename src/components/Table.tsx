"use client";

import TableRow from "./TableRow";
import { memo, useMemo } from "react";

interface Props {
  data: TransformedRatesType[] | undefined;
  isLoading: boolean;
}

const Table: React.FC<Props> = ({ data, isLoading }) => {
  const tableFields: string[] = useMemo(() => {
    if (!data || data.length === 0) return [];
    return Object.keys(
      data[0].rates.reduce((acc, cur) => ({ ...acc, ...cur }), {})
    );
  }, [data]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data?.length) {
    return <div>No data</div>;
  }

  return (
    <table className="table-auto border-collapse border border-slate-400 w-full">
      <thead>
        <tr>
          <th className="border border-slate-300 px-4 py-2">
            <span className="uppercase">DAY</span>
          </th>
          {tableFields.map((currencyCode: string) => (
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
        {data.map((rate: TransformedRatesType) => (
          <TableRow key={rate.date} rate={rate} tableFields={tableFields} />
        ))}
      </tbody>
    </table>
  );
};

export default memo(Table);
