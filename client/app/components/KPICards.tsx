"use client";

import type { PortfolioTotals } from "../types/portfolio";

const INR = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function formatINR(value: number) {
  return INR.format(value);
}

interface KPICardsProps {
  totals?: PortfolioTotals;
}

export default function KPICards({ totals }: KPICardsProps) {
  const t = totals;
  const totalPresentValue = t?.totalPresentValue ?? 0;
  const totalInvestment = t?.totalInvestment ?? 0;
  const gainLoss = t?.gainLoss ?? 0;
  const holdingsCount = t?.holdingsCount ?? 0;
  const isGain = gainLoss >= 0;

  const cards = [
    {
      label: "Portfolio Value",
      value: formatINR(totalPresentValue),
      sub: "at current market prices",
      iconBg: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Total Investment",
      value: formatINR(totalInvestment),
      sub: "total purchase cost",
      iconBg: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      icon: (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2" />
          <path d="M16 3v4M8 3v4M2 11h20" />
        </svg>
      ),
    },
    {
      label: "Gain / Loss",
      value: `${isGain ? "+" : "−"}${formatINR(Math.abs(gainLoss))}`,
      valueClass: isGain ? "text-green-600" : "text-red-600",
      sub: isGain ? "total profit" : "total loss",
      iconBg: isGain
        ? "bg-gradient-to-br from-green-500 to-emerald-600"
        : "bg-gradient-to-br from-red-500 to-rose-600",
      icon: (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {isGain ? (
            <path d="M7 17l5-5 5 5M7 12l5-5 5 5" />
          ) : (
            <path d="M7 7l5 5 5-5M7 12l5 5 5-5" />
          )}
        </svg>
      ),
    },
    {
      label: "Holdings",
      value: String(holdingsCount),
      sub: `${holdingsCount === 1 ? "stock" : "stocks"} in portfolio`,
      iconBg: "bg-gradient-to-br from-amber-500 to-orange-600",
      icon: (
        <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8V4M8 8l4-4 4 4M2 14h2M20 14h2M6 14v4a6 6 0 0 0 12 0v-4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {cards.map((card, i) => (
        <div
          key={card.label}
          className="group relative overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg sm:p-5 animate-fade-in-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-gray-100 opacity-60 transition-transform duration-500 group-hover:scale-150" />

          <div className="relative flex items-start gap-3">
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg shadow-md ${card.iconBg}`}>
              {card.icon}
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {card.label}
              </div>
              <div
                className={`mt-1 truncate text-xl font-bold tabular-nums text-gray-900 sm:text-2xl ${
                  card.valueClass ?? ""
                }`}
              >
                {card.value}
              </div>
              <div className="mt-0.5 text-[11px] text-gray-400">{card.sub}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}