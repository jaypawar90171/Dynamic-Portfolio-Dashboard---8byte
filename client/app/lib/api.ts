import type PortfolioResponse from "../types/portfolio";

const API_URL = "/api/portfolio";

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