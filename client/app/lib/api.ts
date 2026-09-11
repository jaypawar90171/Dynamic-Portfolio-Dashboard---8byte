import type PortfolioResponse from "../types/portfolio";

const API_URL = "/api/portfolio";

export async function fetchPortfolio(): Promise<PortfolioResponse> {
  const res = await fetch(API_URL);

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message =
      body?.error?.message ?? `Request failed (${res.status})`;
    throw new Error(message);
  }

  return res.json();
}
