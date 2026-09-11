"use client";

import { useState } from "react";
import type { Stock, SectorSummary } from "../types/portfolio";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatINR(value: number) {
  return INR.format(value);
}

interface SectorCardProps {
  sector: SectorSummary;
  stocks: Stock[];
}

function SectorCard({ sector, stocks }: SectorCardProps) {
  const [open, setOpen] = useState(false);
  const gl = sector.gainLoss;
  const isGain = gl != null && gl >= 0;
  const glClass =
    gl == null ? "text-gray-400" : isGain ? "text-green-600" : "text-red-600";

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
            {sector.sector}
          </span>
          <span className="text-xs text-gray-400">
            {sector.stockCount} {sector.stockCount === 1 ? "stock" : "stocks"}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <div className="text-[10px] uppercase text-gray-400">Invested</div>
            <div className="tabular-nums text-gray-700">
              {formatINR(sector.totalInvestment)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-gray-400">
              Present Value
            </div>
            <div className="tabular-nums text-gray-700">
              {formatINR(sector.totalPresentValue)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase text-gray-400">
              Gain / Loss
            </div>
            <div className={`tabular-nums font-medium ${glClass}`}>
              {gl == null ? "N/A" : formatINR(Math.abs(gl))}
            </div>
          </div>
          <span className="text-gray-400 transition-transform duration-200 text-xs">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-xs uppercase text-gray-500">
                <th className="px-4 py-2 text-left">Stock</th>
                <th className="px-4 py-2 text-right">Investment</th>
                <th className="px-4 py-2 text-right">Present Value</th>
                <th className="px-4 py-2 text-right">Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => {
                const sgl = stock.gainLoss;
                const sGain = sgl != null && sgl >= 0;
                const sClass =
                  sgl == null
                    ? "text-gray-400"
                    : sGain
                      ? "text-green-600"
                      : "text-red-600";

                return (
                  <tr
                    key={stock.symbol}
                    className="border-t border-gray-50 hover:bg-gray-50/50"
                  >
                    <td className="px-4 py-2">
                      <span className="font-medium">{stock.name}</span>
                      <span className="ml-1 text-xs text-gray-400">
                        {stock.symbol}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {formatINR(stock.investment)}
                    </td>
                    <td className="px-4 py-2 text-right tabular-nums">
                      {stock.presentValue == null
                        ? "N/A"
                        : formatINR(stock.presentValue)}
                    </td>
                    <td
                      className={`px-4 py-2 text-right tabular-nums font-medium ${sClass}`}
                    >
                      {sgl == null ? "N/A" : formatINR(Math.abs(sgl))}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

interface SectorSummaryProps {
  sectors?: SectorSummary[];
  stocks?: Stock[];
}

export default function SectorSummary({ sectors = [], stocks = [] }: SectorSummaryProps) {
  const bySector = new Map<string, Stock[]>();
  for (const s of stocks) {
    const list = bySector.get(s.sector) ?? [];
    list.push(s);
    bySector.set(s.sector, list);
  }

  return (
    <div className="flex flex-col gap-2">
      {sectors.map((sector) => (
        <SectorCard
          key={sector.sector}
          sector={sector}
          stocks={bySector.get(sector.sector) ?? []}
        />
      ))}
    </div>
  );
}
