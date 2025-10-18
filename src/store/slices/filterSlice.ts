import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { calculateInitialDate, DEFAULT_CURRENCY_LIST } from "@/utils/currency";

interface FilterState {
  selectedCurrency: string;
  selectedCurrencies: Option[];
  date: string;

  rates: RatesLoopData[] | null;

  searchParams: {
    base: string;
    date: string;
    isTriggered: boolean;
    isFetching: boolean;
  };
}

const initialState: FilterState = {
  selectedCurrency: "gbp",
  selectedCurrencies: DEFAULT_CURRENCY_LIST,
  date: calculateInitialDate(),
  rates: null,
  searchParams: {
    base: "gbp",
    date: calculateInitialDate(),
    isTriggered: true,
    isFetching: false,
  },
};

const filterSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    setSelectedCurrency: (state, action: PayloadAction<string>) => {
      state.selectedCurrency = action.payload;
      state.searchParams.isTriggered = false;
    },
    setSelectedCurrencies: (state, action: PayloadAction<Option[]>) => {
      state.selectedCurrencies = action.payload;
      state.searchParams.isTriggered = false;
    },
    setDate: (state, action: PayloadAction<string>) => {
      state.date = action.payload;
      state.searchParams.isTriggered = false;
    },

    triggerSearch: (state) => {
      state.searchParams = {
        base: state.selectedCurrency,
        date: state.date,
        isTriggered: true,
        isFetching: true,
      };
    },

    setRatesData: (state, action: PayloadAction<RatesLoopData[]>) => {
      state.rates = action.payload;
      state.searchParams.isFetching = false;
    },
    setFetchingState: (state, action: PayloadAction<boolean>) => {
      state.searchParams.isFetching = action.payload;
    },
  },
});

export const {
  setSelectedCurrency,
  setSelectedCurrencies,
  setDate,
  triggerSearch,
  setRatesData,
  setFetchingState,
} = filterSlice.actions;

export default filterSlice.reducer;
