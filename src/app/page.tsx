"use client";

import Table from "@/components/Table";
import Search from "@/components/Search/Search";
import { Toaster } from "react-hot-toast";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen gap-6 sm:p-10">
      <Search />
      <Table />
      <Toaster position="top-right" />
    </div>
  );
}
