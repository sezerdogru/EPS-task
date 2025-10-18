import { useEffect, useState } from "react";

export default function useFetchCurrencies() {
  const [currencies, setCurrencies] = useState<CurrencyData>();

  const fetchCurrencies = async () => {
    const url =
      "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json";
    try {
      const response = await fetch(url, { cache: "force-cache" });
      if (!response.ok) {
        throw new Error("Failed to fetch currency data");
      }
      const data: CurrencyData = await response.json();
      setCurrencies(data);
    } catch (error) {
      console.error("Error fetching currency data:", error);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  return { currencies };
}
