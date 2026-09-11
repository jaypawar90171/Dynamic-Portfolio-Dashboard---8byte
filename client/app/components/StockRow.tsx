"use client";

import { memo, useEffect, useRef, useState } from "react";
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

const NUMBER_CELL =
  "px-4 py-3 text-right tabular-nums transition-colors duration-500";

interface StockRowProps {
  stock: Stock;
}

function StockRow({ stock }: StockRowProps) {
  const gl = stock.gainLoss;
  const isGain = gl != null && gl >= 0;
  const glClass =
    gl == null
      ? "text-gray-400"
      : isGain
        ? "bg-green-50 text-green-700"
        : "bg-red-50 text-red-700";

  const [flash, setFlash] = useState<"up" | "down" | null>(null);
  const prevCmp = useRef<number | null>(stock.cmp);

  useEffect(() => {
    const prev = prevCmp.current;
    if (prev !== stock.cmp && stock.cmp != null && prev != null) {
      setFlash(stock.cmp > prev ? "up" : "down");
      const t = setTimeout(() => setFlash(null), 1000);
      prevCmp.current = stock.cmp;
      return () => clearTimeout(t);
    }
    prevCmp.current = stock.cmp;
  }, [stock.cmp]);

  const cmpClass = flash == null ? "text-gray-900" : "text-emerald-700";

  return (
    <tr className="border-b border-gray-100 transition-colors duration-300 odd:bg-white even:bg-gray-50/60 hover:bg-blue-50/40">
      <td className="px-4 py-3">
        <div className="font-medium text-gray-900">{stock.name}</div>
        <div className="text-xs text-gray-400">
          {stock.symbol} · {stock.sector}
        </div>
      </td>

      <td className={`${NUMBER_CELL} text-gray-700`}>
        {formatINR(stock.purchasePrice)}
      </td>

      <td className={`${NUMBER_CELL} text-gray-700`}>{stock.quantity}</td>

      <td className={`${NUMBER_CELL} text-gray-700`}>
        {formatINR(stock.investment)}
      </td>

      <td className={`${NUMBER_CELL} text-gray-700`}>
        {stock.portfolioPercent.toFixed(2)}%
      </td>

      <td className="hidden px-4 py-3 text-center lg:table-cell">
        <span
          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${
            stock.exchange === "NSE"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}
        >
          {stock.exchange}
        </span>
      </td>

      <td
        className={`${NUMBER_CELL} font-semibold ${cmpClass} ${
          flash === "up" ? "animate-flash-up" : flash === "down" ? "animate-flash-down" : ""
        }`}
      >
        {formatINR(stock.cmp)}
      </td>

      <td className={`${NUMBER_CELL} text-gray-700`}>
        {formatINR(stock.presentValue)}
      </td>

      <td className={`${NUMBER_CELL} font-medium ${glClass}`}>
        {gl == null ? (
          "N/A"
        ) : (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">{isGain ? "▲" : "▼"}</span>
            {formatINR(Math.abs(gl))}
          </span>
        )}
      </td>

      <td className={`${NUMBER_CELL} hidden text-gray-700 lg:table-cell`}>
        {stock.peRatio == null ? "N/A" : stock.peRatio.toFixed(2)}
      </td>

      <td className="hidden max-w-[140px] truncate px-4 py-3 text-sm text-gray-600 lg:table-cell">
        {stock.latestEarnings ?? "N/A"}
      </td>
    </tr>
  );
}

export default memo(StockRow);