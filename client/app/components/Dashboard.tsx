"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchPortfolio } from "../lib/api";
import type PortfolioResponse from "../types/portfolio";
import DashboardHeader from "./DashboardHeader";
import KPICards from "./KPICards";
import LoadingSkeleton from "./LoadingSkeleton";
import PortfolioTable from "./PortfolioTable";
import SectorSummary from "./SectorSummary";

const REFRESH_INTERVAL_MS = 15_000;

type ConnectionStatus = "live" | "stale" | "error";

export default function Dashboard() {
  const [data, setData] = useState<PortfolioResponse | null>(null);
  const [status, setStatus] = useState<ConnectionStatus>("stale");
  const [error, setError] = useState<string | null>(null);
  const inFlight = useRef(false);
  const hasData = useRef(false);

  const load = useCallback(async () => {
    if (inFlight.current) return;
    inFlight.current = true;

    try {
      const response = await fetchPortfolio();
      hasData.current = true;
      setData(response);
      setError(null);
      setStatus("live");
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setStatus(hasData.current ? "stale" : "error");
    } finally {
      inFlight.current = false;
    }
  }, []);

  useEffect(() => {
    const initial = setTimeout(load, 0);
    const id = setInterval(load, REFRESH_INTERVAL_MS);
    return () => {
      clearTimeout(initial);
      clearInterval(id);
    };
  }, [load]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-slate-50 to-slate-200">
      <DashboardHeader
        lastUpdated={data?.lastUpdated ?? null}
        status={status}
        onRefresh={load}
      />

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-6 sm:px-6">
        {error && data !== null && (
          <div
            className="flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700 animate-fade-in"
            role="alert"
          >
            <svg
              className="h-4 w-4 shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            Showing last-known data. {error}
          </div>
        )}

        {data === null ? (
          status === "error" ? (
            <PortfolioTable error={error} />
          ) : (
            <LoadingSkeleton />
          )
        ) : (
          <div className="flex flex-col gap-5 animate-fade-in">
            <KPICards stocks={data.stocks} />
            <PortfolioTable stocks={data.stocks} />
            <SectorSummary sectors={data.sectors} stocks={data.stocks} />
          </div>
        )}
      </main>

      <footer className="border-t border-gray-200 bg-white/60 py-4 text-center text-xs text-gray-400">
        Data refreshes automatically every 15 seconds
      </footer>
    </div>
  );
}