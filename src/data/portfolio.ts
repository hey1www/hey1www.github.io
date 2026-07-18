// Loads the portfolio data. In viewer mode (public build) we only use
// the bundled TypeScript seed to avoid any runtime fetch. In editor mode
// the local server exposes /api/portfolio which can be reloaded.
import { defaultPortfolio } from "./defaultPortfolio";
import type { Portfolio } from "../types/portfolio";
import { validatePortfolio } from "../utils/portfolioValidation";

const isEditor = __APP_MODE__ === "editor";

let cached: Portfolio = defaultPortfolio;

function readEmbeddedPortfolio(): Portfolio | null {
  if (typeof document === "undefined") return null;
  const node = document.getElementById("heyi-portfolio-data");
  if (!node?.textContent) return null;
  try {
    const parsed = JSON.parse(node.textContent);
    const result = validatePortfolio(parsed);
    if (result.ok) return result.value;
    console.warn("[portfolio] embedded data is invalid:", result.errors);
  } catch (err) {
    console.warn("[portfolio] failed to parse embedded data:", err);
  }
  return null;
}

async function fetchExportedPortfolio(): Promise<Portfolio | null> {
  if (typeof fetch === "undefined") return null;
  try {
    const res = await fetch("./data.json", { cache: "no-cache" });
    if (!res.ok) return null;
    const parsed = await res.json();
    const result = validatePortfolio(parsed);
    if (result.ok) return result.value;
    console.warn("[portfolio] data.json is invalid:", result.errors);
  } catch {
    // Normal viewer builds do not include data.json; silently fall back.
  }
  return null;
}

export async function loadPortfolio(): Promise<Portfolio> {
  if (!isEditor) {
    cached = readEmbeddedPortfolio() ?? (await fetchExportedPortfolio()) ?? defaultPortfolio;
    return cached;
  }
  try {
    const res = await fetch("/api/portfolio");
    if (!res.ok) throw new Error(`status ${res.status}`);
    const parsed = await res.json();
    const result = validatePortfolio(parsed);
    if (!result.ok) throw new Error(result.errors.join("; "));
    cached = result.value;
  } catch (err) {
    console.warn("[portfolio] falling back to default seed:", err);
    cached = defaultPortfolio;
  }
  return cached;
}

export function getPortfolioSync(): Portfolio {
  return cached;
}
