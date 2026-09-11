"use client";

import type { Stock } from "../types/portfolio";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatINR(value: number) {
  return INR.format(value);
}

interface CardData {
  label: string;
  value: string;
  valueClass?: string;
  sub: string;
}

interface KPICardsProps {
  stocks?: Stock[];
}

export default function KPICards({ stocks = [] }: KPICardsProps) {
  const totalPresentValue = stocks.reduce(
    (sum, s) => sum + (s.presentValue ?? 0),
    0
  );
  const totalInvestment = stocks.reduce((sum, s) => sum + s.investment, 0);
  const gainLoss = totalPresentValue - totalInvestment;
  const isGain = gainLoss >= 0;

  const cards: CardData[] = [
    {
      label: "Portfolio Value",
      value: formatINR(totalPresentValue),
      sub: "at current market prices",
    },
    {
      label: "Total Investment",
      value: formatINR(totalInvestment),
      sub: "purchase cost",
    },
    {
      label: "Gain / Loss",
      value: `${isGain ? "+" : "−"}${formatINR(Math.abs(gainLoss))}`,
      valueClass: isGain ? "text-green-600" : "text-red-600",
      sub: isGain ? "you're in profit" : "you're at a loss",
    },
    {
      label: "Holdings",
      value: String(stocks.length),
      sub: `${stocks.length === 1 ? "stock" : "stocks"} in portfolio`,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
        >
          <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
            {card.label}
          </div>
          <div
            className={`mt-2 text-2xl font-semibold tabular-nums text-gray-900 ${
              card.valueClass ?? ""
            }`}
          >
            {card.value}
          </div>
          <div className="mt-1 text-xs text-gray-400">{card.sub}</div>
        </div>
      ))}
    </div>
  );
}