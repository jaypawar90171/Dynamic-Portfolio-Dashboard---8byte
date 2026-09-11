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
    <main className="flex w-full max-w-7xl flex-col gap-4 px-4 py-6">
      <DashboardHeader
        lastUpdated={data?.lastUpdated ?? null}
        status={status}
        onRefresh={load}
      />

      {error && data !== null && (
        <div className="rounded-md border border-amber-200 bg-amber-50 px-4 py-2.5 text-sm text-amber-700">
          Showing last-known data. {error}
        </div>
      )}

      {data === null ? (
        <LoadingSkeleton />
      ) : (
        <>
          <KPICards stocks={data.stocks} />
          <PortfolioTable
            stocks={data.stocks}
            loading={false}
            error={null}
          />
          <SectorSummary sectors={data.sectors} stocks={data.stocks} />
        </>
      )}
    </main>
  );
}