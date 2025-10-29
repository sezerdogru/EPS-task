import { memo } from "react";

interface Props {
  rate: TransformedRatesType;
  tableFields: string[];
}

const TableRow = ({ rate, tableFields }: Props) => {
  return (
    <tr>
      <td className="border border-slate-300 px-4 py-2">{rate.date}</td>
      {Object.values(rate.rates).map((data: CurrencyType, index: number) => {
        const curr = tableFields[index];
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
