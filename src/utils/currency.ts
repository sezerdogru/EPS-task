import moment from "moment";

export const DEFAULT_CURRENCY_LIST: Option[] = [
  { value: "usd", label: "US Dollar" },
  { value: "eur", label: "Euro" },
  { value: "jpy", label: "Japanese Yen" },
  { value: "chf", label: "Swiss Franc" },
  { value: "cad", label: "Canadian Dollar" },
  { value: "aud", label: "Australian Dollar" },
  { value: "zar", label: "South African Rand" },
];

export const calculateInitialDate = (): string => {
  return moment().subtract(7, "days").format("YYYY-MM-DD");
};

export const calculateDatesInRange = (startDate: string): string[] => {
  const dates: string[] = [];
  const currentDate = moment(startDate, "YYYY-MM-DD");
  const today = moment();

  while (currentDate.isSameOrBefore(today)) {
    dates.push(currentDate.format("YYYY-MM-DD"));
    currentDate.add(1, "day");
  }
  return dates;
};

export const transformRatesData = (
  rawRates: RatesType[],
  baseCurrency: string,
  compareCurrencies: Option[]
): TransformedRatesType[] => {
  const base = baseCurrency.toLowerCase();

  const transformedRates: TransformedRatesType[] = rawRates
    .map((rate) => {
      const baseData = rate[base] as { [key: string]: number };

      return {
        date: rate.date,
        rates: compareCurrencies.map((currency: Option) => {
          const targetCode = currency.value.toLowerCase();

          return {
            [targetCode]: baseData?.[targetCode] ?? null,
          };
        }),
      };
    })
    .reverse();

  return transformedRates;
};
