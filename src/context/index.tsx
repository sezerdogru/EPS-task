"use client";
import { ReactNode } from "react";
import { BaseCurrencyProvider } from "./BaseCurrencyContext";
import { DateProvider } from "./DateContext";
import { SelectedCurrenciesProvider } from "./SelectedCurrenciesContext";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  return (
    <BaseCurrencyProvider>
      <DateProvider>
        <SelectedCurrenciesProvider>{children}</SelectedCurrenciesProvider>
      </DateProvider>
    </BaseCurrencyProvider>
  );
}
