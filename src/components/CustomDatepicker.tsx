"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import { useAppSelector, useAppDispatch } from "@/store/store";
import { setDate } from "@/store/slices/filterSlice";

export default function CustomDatepicker() {
  const dispatch = useAppDispatch();

  const date = useAppSelector((state) => state.filters.date);

  const today = new Date();
  const yesterday = moment().subtract(1, "days").toDate();
  const past90Days = moment(today).subtract(90, "days").toDate();

  return (
    <DatePicker
      selected={moment(date, "YYYY-MM-DD").toDate()}
      onChange={(newDate) => {
        if (newDate) {
          const formattedDate = moment(newDate).format("YYYY-MM-DD");
          dispatch(setDate(formattedDate));
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
