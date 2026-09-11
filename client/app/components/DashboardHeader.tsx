"use client";

type ConnectionStatus = "live" | "stale" | "error";

const STATUS_STYLE: Record<ConnectionStatus, { dot: string; label: string }> = {
  live: { dot: "bg-green-500 shadow-green-500/50", label: "Live" },
  stale: { dot: "bg-amber-400 shadow-amber-400/50", label: "Refreshing..." },
  error: { dot: "bg-red-500 shadow-red-500/50", label: "Connection lost" },
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
    <div className="sticky top-0 z-30 border-b border-gray-800 bg-gray-900/95 backdrop-blur supports-backdrop-blur:backdrop-blur">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-base font-semibold tracking-tight text-white sm:text-lg">
            Portfolio Dashboard
          </h1>

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span
              className={`inline-block h-2 w-2 rounded-full shadow-sm ${dot} transition-colors duration-300`}
              aria-hidden="true"
            />
            <span>{label}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <span className="hidden text-xs text-gray-500 sm:inline">
            Last updated: {formatTimestamp(lastUpdated)}
          </span>

          <button
            onClick={onRefresh}
            disabled={status === "stale"}
            className="flex items-center gap-1.5 rounded-md bg-gray-700 px-3 py-1.5 text-xs font-medium text-gray-200 transition-colors hover:bg-gray-600 active:bg-gray-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "stale" && (
              <svg
                className="h-3.5 w-3.5 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                  className="opacity-20"
                />
                <path
                  d="M12 2a10 10 0 0 1 10 10"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            )}
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}