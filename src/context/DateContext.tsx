"use client";
import { createContext, useContext, useState, ReactNode } from "react";
import { calculateInitialDate } from "@/utils/currency";

type DateContextType = {
  date: string;
  setDate: (value: string) => void;
};

const DateContext = createContext<DateContextType | undefined>(undefined);

export const DateProvider = ({ children }: { children: ReactNode }) => {
  const [date, setDate] = useState<string>(calculateInitialDate());

  return (
    <DateContext.Provider value={{ date, setDate }}>
      {children}
    </DateContext.Provider>
  );
};

export const useDateContext = () => {
  const ctx = useContext(DateContext);
  if (!ctx) throw new Error("useDateContext must be used within DateProvider");
  return ctx;
};
