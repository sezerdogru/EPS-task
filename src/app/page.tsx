"use client";

import { Table } from "./components/Table";

import Search from "./components/Search";

export default function Home() {
  return (
    <div className="font-sans flex flex-col items-center justify-items-center min-h-screen gap-6 sm:p-20">
      <Search />
      <Table />
    </div>
  );
}
