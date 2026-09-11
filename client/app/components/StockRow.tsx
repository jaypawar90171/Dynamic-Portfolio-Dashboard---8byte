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
        ? "text-green-600 bg-green-50"
        : "text-red-600 bg-red-50";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50/50 transition-colors">
      <td className="px-4 py-3">
        <span className="font-medium text-gray-900">{stock.name}</span>
        <span className="ml-1 text-xs text-gray-400">{stock.symbol}</span>
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {formatINR(stock.purchasePrice)}
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {stock.quantity}
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {formatINR(stock.investment)}
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {stock.portfolioPercent.toFixed(2)}%
      </td>

      <td className="px-4 py-3 text-center">
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${
            stock.exchange === "NSE"
              ? "bg-blue-50 text-blue-600"
              : "bg-purple-50 text-purple-600"
          }`}
        >
          {stock.exchange}
        </span>
      </td>

      <td className="px-4 py-3 text-right tabular-nums font-semibold text-gray-900">
        {formatINR(stock.cmp)}
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {formatINR(stock.presentValue)}
      </td>

      <td className={`px-4 py-3 text-right tabular-nums font-medium ${glClass}`}>
        {gl == null ? (
          "N/A"
        ) : (
          <span className="inline-flex items-center gap-1">
            <span aria-hidden="true">{isGain ? "▲" : "▼"}</span>
            {formatINR(Math.abs(gl))}
          </span>
        )}
      </td>

      <td className="px-4 py-3 text-right tabular-nums text-gray-700">
        {stock.peRatio == null ? "N/A" : stock.peRatio.toFixed(2)}
      </td>

      <td className="px-4 py-3 text-sm text-gray-600 max-w-[140px] truncate">
        {stock.latestEarnings ?? "N/A"}
      </td>
    </tr>
  );
}

export default memo(StockRow);
