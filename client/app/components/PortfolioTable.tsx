"use client";

import { useMemo, useState } from "react";
import type { Stock } from "../types/portfolio";
import StockRow from "./StockRow";
import MobileStockCard from "./MobileStockCard";

type SortKey = keyof Stock;
type SortDir = "asc" | "desc";

const COLUMNS: {
  key: SortKey;
  label: string;
  hideBelow?: "lg";
}[] = [
  { key: "name", label: "Particulars" },
  { key: "purchasePrice", label: "Purchase Price" },
  { key: "quantity", label: "Qty" },
  { key: "investment", label: "Investment" },
  { key: "portfolioPercent", label: "Portfolio (%)" },
  { key: "exchange", label: "NSE/BSE", hideBelow: "lg" },
  { key: "cmp", label: "CMP" },
  { key: "presentValue", label: "Present Value" },
  { key: "gainLoss", label: "Gain/Loss" },
  { key: "peRatio", label: "P/E Ratio", hideBelow: "lg" },
  { key: "latestEarnings", label: "Latest Earnings", hideBelow: "lg" },
];

function compare(a: Stock[keyof Stock], b: Stock[keyof Stock]): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

export default function PortfolioTable({
  stocks = [],
  error = null,
}: {
  stocks?: Stock[];
  error?: string | null;
}) {
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    return [...stocks].sort((a, b) => {
      const v = compare(a[sortKey], b[sortKey]);
      return sortDir === "asc" ? v : -v;
    });
  }, [stocks, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const thClass = (hideBelow?: "lg") =>
    `cursor-pointer select-none whitespace-nowrap px-4 py-3 font-semibold uppercase tracking-wider transition-colors hover:text-white ${
      hideBelow ? "hidden lg:table-cell" : ""
    }`;

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-sm font-medium text-red-600">
          Failed to load portfolio
        </p>
        <p className="mt-1 text-xs text-red-400">{error}</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white px-6 py-12 text-center shadow-sm">
        <p className="text-sm text-gray-400">No holdings to display</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-3 md:hidden">
        {sorted.map((stock) => (
          <MobileStockCard key={stock.symbol} stock={stock} />
        ))}
      </div>

      <div className="hidden overflow-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm border-separate border-spacing-0">
          <thead className="sticky top-0 z-10">
            <tr className="text-left text-xs text-gray-300">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`${thClass(col.hideBelow)} bg-gray-900`}
                >
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {sortKey === col.key && (
                      <span className="text-white">
                        {sortDir === "asc" ? "▲" : "▼"}
                      </span>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}