import type PortfolioResponse from "../types/portfolio";

const BACKEND_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  "https://dynamic-portfolio-dashboard-8byte-1.onrender.com";

const API_URL = `${BACKEND_BASE}/api/portfolio`;

export interface FetchPortfolioParams {
  page?: number;
  limit?: number;
}

export async function fetchPortfolio(
  params: FetchPortfolioParams = {}
): Promise<PortfolioResponse> {
  const { page, limit } = params;
  const query = new URLSearchParams();
  if (page != null) query.set("page", String(page));
  if (limit != null) query.set("limit", String(limit));
  const qs = query.toString();
  const url = qs ? `${API_URL}?${qs}` : API_URL;

  const res = await fetch(url);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}