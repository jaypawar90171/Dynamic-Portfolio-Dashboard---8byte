"use client";

import { useState } from "react";
import type { Stock, SectorSummary as SectorSummaryType } from "../types/portfolio";

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
  sector: SectorSummaryType;
  stocks: Stock[];
}

function SectorCard({ sector, stocks }: SectorCardProps) {
  const [open, setOpen] = useState(false);
  const gl = sector.gainLoss;
  const isGain = gl != null && gl >= 0;
  const glClass =
    gl == null
      ? "text-gray-400"
      : isGain
        ? "text-green-700"
        : "text-red-700";

  return (
    <div className="animate-fade-in-up overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-4 py-3.5 text-left transition-colors hover:bg-gray-50 sm:px-5"
      >
        <div className="flex items-center gap-3">
          <span
            className={`inline-block h-2 w-2 rounded-full transition-colors ${
              isGain ? "bg-green-500" : gl == null ? "bg-gray-300" : "bg-red-500"
            }`}
          />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
            {sector.sector}
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-medium text-gray-500">
            {sector.stockCount}
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm">
          <div className="hidden text-right sm:block">
            <div className="text-[10px] uppercase text-gray-400">Invested</div>
            <div className="tabular-nums text-gray-700">
              {formatINR(sector.totalInvestment)}
            </div>
          </div>
          <div className="hidden text-right sm:block">
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
            <div className={`tabular-nums font-semibold ${glClass}`}>
              {gl == null ? "N/A" : formatINR(Math.abs(gl))}
            </div>
          </div>
          <span className="text-gray-400 transition-transform duration-300 text-xs">
            {open ? "▲" : "▼"}
          </span>
        </div>
      </button>

      {open && (
        <div className="border-t border-gray-100 animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-[10px] uppercase tracking-wider text-gray-500">
                  <th className="px-4 py-2 text-left">Stock</th>
                  <th className="px-4 py-2 text-right">CMP</th>
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
                      className="transition-colors odd:bg-white even:bg-gray-50/50 hover:bg-blue-50/40"
                    >
                      <td className="px-4 py-2.5">
                        <span className="font-medium text-gray-900">
                          {stock.name}
                        </span>
                        <span className="ml-1 text-xs text-gray-400">
                          {stock.symbol}
                        </span>
                      </td>
                      <td className="px-4 py-2.5 text-right font-semibold tabular-nums text-gray-900">
                        {stock.cmp == null ? "N/A" : formatINR(stock.cmp)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">
                        {formatINR(stock.investment)}
                      </td>
                      <td className="px-4 py-2.5 text-right tabular-nums text-gray-700">
                        {stock.presentValue == null
                          ? "N/A"
                          : formatINR(stock.presentValue)}
                      </td>
                      <td
                        className={`px-4 py-2.5 text-right tabular-nums font-medium ${sClass}`}
                      >
                        {sgl == null ? "N/A" : formatINR(Math.abs(sgl))}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

interface SectorSummaryProps {
  sectors?: SectorSummaryType[];
  stocks?: Stock[];
}

export default function SectorSummary({
  sectors = [],
  stocks = [],
}: SectorSummaryProps) {
  const bySector = new Map<string, Stock[]>();
  for (const s of stocks) {
    const list = bySector.get(s.sector) ?? [];
    list.push(s);
    bySector.set(s.sector, list);
  }

  return (
    <section>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
        Sector Breakdown
      </h2>
      <div className="flex flex-col gap-2">
        {sectors.map((sector) => (
          <SectorCard
            key={sector.sector}
            sector={sector}
            stocks={bySector.get(sector.sector) ?? []}
          />
        ))}
      </div>
    </section>
  );
}