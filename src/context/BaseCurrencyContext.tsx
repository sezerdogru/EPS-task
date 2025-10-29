"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type BaseCurrencyContextType = {
  selectedCurrency: string;
  setSelectedCurrency: (value: string) => void;
};

const BaseCurrencyContext = createContext<BaseCurrencyContextType | undefined>(
  undefined
);

export const BaseCurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("gbp");
  return (
    <BaseCurrencyContext.Provider
      value={{ selectedCurrency, setSelectedCurrency }}
    >
      {children}
    </BaseCurrencyContext.Provider>
  );
};

export const useBaseCurrency = () => {
  const ctx = useContext(BaseCurrencyContext);
  if (!ctx)
    throw new Error("useBaseCurrency must be used within BaseCurrencyProvider");
  return ctx;
};
