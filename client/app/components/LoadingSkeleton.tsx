const SHIMMER_BASE =
  "animate-shimmer bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 bg-[length:200%_100%] rounded";

const KPI_WIDTHS = ["w-24", "w-28", "w-28", "w-16"];
const ROW_CELL_COUNT = 7;

export default function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-4" aria-busy="true" aria-label="Loading">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {KPI_WIDTHS.map((width, i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className={`h-3 ${width} ${SHIMMER_BASE}`} />
            <div className="mt-3 h-7 w-32 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-shimmer bg-[length:200%_100%] rounded" />
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center gap-4 bg-gray-900 px-4 py-3">
          <div className="h-3 w-1/3 rounded bg-gray-700" />
          <div className="h-3 w-20 rounded bg-gray-700" />
          <div className="ml-auto h-5 w-20 rounded bg-gray-700" />
        </div>

        {Array.from({ length: 8 }).map((_, row) => (
          <div
            key={row}
            className="flex items-center gap-4 border-b border-gray-100 px-4 py-3.5"
          >
            <div className={`h-4 w-36 ${SHIMMER_BASE}`} />
            {Array.from({ length: ROW_CELL_COUNT }).map((_, i) => (
              <div
                key={i}
                className={`h-4 flex-1 ${SHIMMER_BASE}`}
                style={{ width: `${40 + ((row * 13 + i * 17) % 50)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}