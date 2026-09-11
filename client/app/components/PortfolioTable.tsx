"use client";

import { useMemo, useState } from "react";
import type { Stock } from "../types/portfolio";
import StockRow from "./StockRow";

type SortKey = keyof Stock;
type SortDir = "asc" | "desc";

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: "name", label: "Particulars" },
  { key: "purchasePrice", label: "Purchase Price" },
  { key: "quantity", label: "Qty" },
  { key: "investment", label: "Investment" },
  { key: "portfolioPercent", label: "Portfolio (%)" },
  { key: "exchange", label: "NSE/BSE" },
  { key: "cmp", label: "CMP" },
  { key: "presentValue", label: "Present Value" },
  { key: "gainLoss", label: "Gain/Loss" },
  { key: "peRatio", label: "P/E Ratio" },
  { key: "latestEarnings", label: "Latest Earnings" },
];

function compare(a: Stock[keyof Stock], b: Stock[keyof Stock]): number {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

const SKELETON_WIDTHS = [80, 65, 50, 75, 60, 70, 55, 80, 45, 60];

function TableSkeleton() {
  return (
    <tbody>
      {Array.from({ length: 8 }).map((_, row) => (
        <tr key={row} className="border-b border-gray-100 animate-pulse">
          {COLUMNS.map((col, i) => (
            <td key={col.key} className="px-4 py-3">
              <div
                className="h-4 rounded bg-gray-200"
                style={{ width: `${SKELETON_WIDTHS[i % SKELETON_WIDTHS.length]}%` }}
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

interface PortfolioTableProps {
  stocks?: Stock[];
  loading?: boolean;
  error?: string | null;
}

export default function PortfolioTable({
  stocks = [],
  loading = false,
  error = null,
}: PortfolioTableProps) {
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

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-900 text-left text-xs font-semibold uppercase tracking-wider text-gray-300">
            {COLUMNS.map((col) => (
              <th
                key={col.key}
                onClick={() => handleSort(col.key)}
                className="cursor-pointer select-none px-4 py-3 whitespace-nowrap hover:text-white transition-colors"
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

        {loading ? (
          <TableSkeleton />
        ) : error ? (
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-12 text-center">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-sm font-medium text-red-600">
                    Failed to load portfolio
                  </span>
                  <span className="text-xs text-gray-500">{error}</span>
                </div>
              </td>
            </tr>
          </tbody>
        ) : stocks.length === 0 ? (
          <tbody>
            <tr>
              <td colSpan={COLUMNS.length} className="px-4 py-12 text-center">
                <span className="text-sm text-gray-400">
                  No holdings to display
                </span>
              </td>
            </tr>
          </tbody>
        ) : (
          <tbody>
            {sorted.map((stock) => (
              <StockRow key={stock.symbol} stock={stock} />
            ))}
          </tbody>
        )}
      </table>
    </div>
  );
}
