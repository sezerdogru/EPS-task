"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useCurrencyRates } from "@/context/CurrencyContext";

export default function CustomDatepicker() {
  const today = new Date();
  const yesterday = moment().subtract(1, "days").toDate();
  const past90Days = moment(today).subtract(90, "days").toDate();
  const { setDate, date } = useCurrencyRates();

  return (
    <DatePicker
      selected={moment(date, "YYYY-MM-DD").toDate()}
      onChange={(date) => {
        if (date) {
          setDate(moment(date).format("YYYY-MM-DD"));
        }
      }}
      className="w-full h-10 p-2 border rounded-md border-gray-300 hover:border-gray-300 focus:border-gray-300"
      minDate={past90Days}
      maxDate={yesterday}
      dateFormat="yyyy-MM-dd"
      placeholderText="Select a date"
    />
  );
}
