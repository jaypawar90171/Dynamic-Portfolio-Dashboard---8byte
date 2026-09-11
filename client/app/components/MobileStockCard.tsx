"use client";

import { memo } from "react";
import type { Stock } from "../types/portfolio";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatINR(value: number | null) {
  return value == null ? "N/A" : INR.format(value);
}

interface MobileStockCardProps {
  stock: Stock;
}

function MobileStockCard({ stock }: MobileStockCardProps) {
  const gl = stock.gainLoss;
  const isGain = gl != null && gl >= 0;
  const glClass =
    gl == null
      ? "text-gray-400"
      : isGain
        ? "text-green-700"
        : "text-red-700";

  const accent =
    gl == null
      ? "bg-gray-200"
      : isGain
        ? "bg-green-500"
        : "bg-red-500";

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className={`h-1 w-full ${accent}`} />
      <div className="flex items-start justify-between gap-2 px-4 pt-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900">{stock.name}</h3>
            <span
              className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                stock.exchange === "NSE"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-purple-100 text-purple-700"
              }`}
            >
              {stock.exchange}
            </span>
          </div>
          <div className="text-xs text-gray-400">
            {stock.symbol} · {stock.sector}
          </div>
        </div>
        <div className={`text-right font-semibold tabular-nums ${glClass}`}>
          {gl == null ? (
            "N/A"
          ) : (
            <span className="inline-flex items-center gap-1">
              <span aria-hidden="true">{isGain ? "▲" : "▼"}</span>
              {formatINR(Math.abs(gl))}
            </span>
          )}
          <div className="text-[10px] font-normal text-gray-400">
            gain / loss
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-y-2 px-4 py-3 text-sm">
        <div className="flex justify-between pr-2">
          <span className="text-gray-500">Qty</span>
          <span className="font-medium tabular-nums">{stock.quantity}</span>
        </div>
        <div className="flex justify-between pl-2">
          <span className="text-gray-500">CMP</span>
          <span className="font-semibold tabular-nums">
            {formatINR(stock.cmp)}
          </span>
        </div>
        <div className="flex justify-between pr-2">
          <span className="text-gray-500">Invested</span>
          <span className="font-medium tabular-nums">
            {formatINR(stock.investment)}
          </span>
        </div>
        <div className="flex justify-between pl-2">
          <span className="text-gray-500">Present Val.</span>
          <span className="font-medium tabular-nums">
            {formatINR(stock.presentValue)}
          </span>
        </div>
        <div className="flex justify-between pr-2">
          <span className="text-gray-500">P/E</span>
          <span className="font-medium tabular-nums">
            {stock.peRatio == null ? "N/A" : stock.peRatio.toFixed(2)}
          </span>
        </div>
        <div className="flex justify-between pl-2">
          <span className="text-gray-500">Portfolio</span>
          <span className="font-medium tabular-nums">
            {stock.portfolioPercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {(stock.latestEarnings ?? null) !== null && (
        <div className="border-t border-gray-100 bg-gray-50 px-4 py-2 text-xs text-gray-500">
          Latest earnings: {stock.latestEarnings}
        </div>
      )}
    </div>
  );
}

export default memo(MobileStockCard);