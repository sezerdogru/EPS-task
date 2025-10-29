"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import type { ActionMeta } from "react-select";
import { DEFAULT_CURRENCY_LIST } from "@/utils/currency";

export type Option = {
  value: string;
  label: string;
};

type SelectedCurrenciesContextType = {
  selectedCurrencies: Option[];
  handleChange: (newValue: unknown, actionMeta: ActionMeta<unknown>) => void;
};

const SelectedCurrenciesContext = createContext<
  SelectedCurrenciesContextType | undefined
>(undefined);

export const SelectedCurrenciesProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [selectedCurrencies, setSelectedCurrencies] = useState<Option[]>(
    DEFAULT_CURRENCY_LIST
  );

  const handleChange = (newValue: unknown, actionMeta: ActionMeta<unknown>) => {
    const valueArray = newValue as Option[];
    switch (actionMeta.action) {
      case "remove-value":
      case "pop-value":
        if (valueArray.length < 3) {
          alert("List must consist of min 3 elements!");
          return;
        }
        break;
      case "clear":
        alert("Cannot clear all items, minimum 3 required!");
        return;
    }
    if (valueArray.length > 7) {
      alert("List must consist of max 7 elements!");
      return;
    }
    setSelectedCurrencies(valueArray);
  };

  return (
    <SelectedCurrenciesContext.Provider
      value={{ selectedCurrencies, handleChange }}
    >
      {children}
    </SelectedCurrenciesContext.Provider>
  );
};

export const useSelectedCurrencies = () => {
  const ctx = useContext(SelectedCurrenciesContext);
  if (!ctx)
    throw new Error(
      "useSelectedCurrencies must be used within SelectedCurrenciesProvider"
    );
  return ctx;
};
