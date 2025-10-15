import { memo } from "react";

interface TableRowProps {
  rate: RatesLoopData;
  currencyList: string[];
}

const TableRow = ({ rate, currencyList }: TableRowProps) => {
  return (
    <tr>
      <td className="border border-slate-300 px-4 py-2">{rate.date}</td>
      {Object.values(rate.rates).map((data: CurrencyData, index: number) => {
        const curr = currencyList[index];
        return (
          <td key={index} className="border border-slate-300 px-4 py-2">
            {data[curr] !== null ? data[curr]?.toFixed(4) : "N/A"}
          </td>
        );
      })}
    </tr>
  );
};

export default memo(TableRow);
