import YahooFinance from "yahoo-finance2";
const yf = new YahooFinance();
const MAX_RETRIES = 3;
function toYahooSymbol(holding) {
    return holding.exchange === "NSE" ? `${holding.symbol}.NS` : `${holding.symbol}.BO`;
}
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
// Fetches Yahoo Finance data for the given holdings, with retry logic in case of failures.
async function fetchOnce(holdings) {
    const symbols = holdings.map(toYahooSymbol);
    const quotes = await yf.quote(symbols);
    const result = {};
    for (const quote of quotes) {
        const cmp = quote.regularMarketPrice ?? null;
        const peRatio = quote.trailingPE ?? null;
        const latestEarnings = quote.earningsTimestamp ? quote.earningsTimestamp.toISOString().slice(0, 10) : null;
        result[quote.symbol] = { cmp, peRatio, latestEarnings };
    }
    return result;
}
export async function fetchYahooData(holdings) {
    let attempt = 1;
    while (true) {
        try {
            return await fetchOnce(holdings);
        }
        catch (error) {
            if (attempt >= MAX_RETRIES) {
                throw error;
            }
            const delay = 500 * 2 ** (attempt - 1);
            await sleep(delay);
            attempt += 1;
        }
    }
}
//# sourceMappingURL=yahooFinance.js.map