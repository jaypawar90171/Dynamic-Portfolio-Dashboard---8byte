"use client";

type ConnectionStatus = "live" | "stale" | "error";

const STATUS_STYLE: Record<ConnectionStatus, { dot: string; label: string }> = {
  live: { dot: "bg-green-500", label: "Live" },
  stale: { dot: "bg-amber-400", label: "Refreshing..." },
  error: { dot: "bg-red-500", label: "Connection lost" },
};

function formatTimestamp(iso: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

interface DashboardHeaderProps {
  lastUpdated: string | null;
  status: ConnectionStatus;
  onRefresh: () => void;
}

export default function DashboardHeader({
  lastUpdated,
  status,
  onRefresh,
}: DashboardHeaderProps) {
  const { dot, label } = STATUS_STYLE[status];

  return (
    <header className="flex items-center justify-between rounded-lg bg-gray-900 px-5 py-3.5 text-white shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight">
          Portfolio Dashboard
        </h1>

        <div className="flex items-center gap-2 text-sm text-gray-400">
          <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden="true" />
          <span>{label}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-xs text-gray-500">
          Last updated: {formatTimestamp(lastUpdated)}
        </span>

        <button
          onClick={onRefresh}
          className="rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-600 active:bg-gray-500"
        >
          Refresh
        </button>
      </div>
    </header>
  );
}
