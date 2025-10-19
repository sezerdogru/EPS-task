import { createApi, BaseQueryApi } from "@reduxjs/toolkit/query/react";
import { RootState } from "@/store/store";
import toast from "react-hot-toast";
import { transformRatesData, calculateDatesInRange } from "@/utils/currency";

type GetRatesArgs = { base: string; date: string };

const customBaseQuery = async (
  { base, date }: GetRatesArgs,
  api: BaseQueryApi
) => {
  const dates = calculateDatesInRange(date);

  try {
    const allRates = await Promise.allSettled(
      dates.map(async (d) => {
        const url = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@${d}/v1/currencies/${base}.json`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch for date ${d}`);
        }
        const data: RatesData = await response.json();
        return data;
      })
    );

    const rejected = allRates.filter(
      (r): r is PromiseRejectedResult => r.status === "rejected"
    );
    if (rejected.length > 0) {
      const failedDates = rejected.map((r) => r.reason.message).join(", ");
      toast.error(failedDates);
      return {
        error: { status: 500, data: `Failed to fetch: ${failedDates}` },
      };
    }

    const successfulRates = allRates
      .filter(
        (r): r is PromiseFulfilledResult<RatesData> => r.status === "fulfilled"
      )
      .map((r) => r.value);

    const state = api.getState() as RootState;
    const compareCurrencies = state.filters.selectedCurrencies;

    const transformedRates = transformRatesData(
      successfulRates,
      base,
      compareCurrencies
    );

    return { data: transformedRates };
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return {
      error: {
        status: "FETCH_ERROR",
        data: message,
      },
    };
  }
};

export const currencyApi = createApi({
  reducerPath: "currencyApi",
  baseQuery: (args, api) => customBaseQuery(args as GetRatesArgs, api),

  endpoints: (builder) => ({
    getRates: builder.query<RatesLoopData[], GetRatesArgs>({
      query: ({ base, date }) => ({ base, date }),
    }),

    getAllCurrencies: builder.query<Record<string, string>, void>({
      queryFn: async () => {
        try {
          const res = await fetch(
            "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json"
          );
          if (!res.ok) throw new Error("Failed to fetch currencies");
          const data = await res.json();
          return { data };
        } catch (error: unknown) {
          const message =
            error instanceof Error ? error.message : "Unknown error occurred";

          return {
            error: {
              status: 500,
              data: message,
            },
          };
        }
      },
    }),
  }),
});

export const {
  useGetRatesQuery,
  useLazyGetRatesQuery,
  useGetAllCurrenciesQuery,
} = currencyApi;
