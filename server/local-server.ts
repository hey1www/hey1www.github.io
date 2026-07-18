/**
 * Local editor server. Listens ONLY on 127.0.0.1 to avoid exposing
 * editing APIs on the public network. Persists the portfolio to
 * data/portfolio.json.
 *
 * Run with:  npm run server   (port 5174)
 */
import express, { type Request, type Response } from "express";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validatePortfolio } from "../src/utils/portfolioValidation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const DATA_FILE = path.join(ROOT, "data", "portfolio.json");
const BACKUP_DIR = path.join(ROOT, "data", "backups");
const STATIC_DATA_FILE = path.join(ROOT, "dist-static", "data.json");

// Re-use the TypeScript seed if data/portfolio.json hasn't been written.
async function readSeed(): Promise<unknown> {
  // Try a few paths because tsx may run from src or root.
  const candidates = [
    path.join(ROOT, "data", "portfolio.json"),
    path.join(ROOT, "src", "data", "defaultPortfolio.ts"),
  ];
  for (const c of candidates) {
    if (fs.existsSync(c) && c.endsWith(".json")) {
      return JSON.parse(fs.readFileSync(c, "utf-8"));
    }
  }
  // Fallback: import the TS seed using tsx loader.
  const mod = await import("../src/data/defaultPortfolio.ts");
  return (mod as any).defaultPortfolio;
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function writeJsonAtomic(file: string, data: unknown) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tempFile = `${file}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), "utf-8");
  fs.renameSync(tempFile, file);
}

function backupCurrentPortfolio() {
  if (!fs.existsSync(DATA_FILE)) return null;
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
  const backupFile = path.join(BACKUP_DIR, `portfolio-${timestamp()}.json`);
  fs.copyFileSync(DATA_FILE, backupFile);
  return backupFile;
}

function validateRequestPortfolio(body: unknown) {
  const result = validatePortfolio(body);
  if (!result.ok) {
    return { ok: false as const, errors: result.errors };
  }
  return { ok: true as const, value: result.value };
}

const app = express();
app.use(express.json({ limit: "5mb" }));

app.get("/api/portfolio", async (_req: Request, res: Response) => {
  try {
    let data: unknown;
    if (fs.existsSync(DATA_FILE)) {
      data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } else {
      data = await readSeed();
    }
    const result = validatePortfolio(data);
    if (!result.ok) {
      res.status(500).json({ error: "Invalid portfolio data", details: result.errors });
      return;
    }
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/portfolio", async (req: Request, res: Response) => {
  try {
    const result = validateRequestPortfolio(req.body);
    if (!result.ok) {
      res.status(400).json({ error: "Invalid portfolio payload", details: result.errors });
      return;
    }
    const backupFile = backupCurrentPortfolio();
    writeJsonAtomic(DATA_FILE, result.value);
    res.json({ ok: true, backup: backupFile });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

app.post("/api/export", async (req: Request, res: Response) => {
  try {
    const body = req.body && Object.keys(req.body).length ? req.body : await readSeed();
    const result = validateRequestPortfolio(body);
    if (!result.ok) {
      res.status(400).json({ error: "Invalid export payload", details: result.errors });
      return;
    }
    writeJsonAtomic(STATIC_DATA_FILE, result.value);
    res.json({ ok: true, path: path.dirname(STATIC_DATA_FILE) });
  } catch (err) {
    res.status(500).json({ error: String(err) });
  }
});

const PORT = Number(process.env.PORT || 5174);
app.listen(PORT, "127.0.0.1", () => {
  // eslint-disable-next-line no-console
  console.log(`[heyi-portal] local editor server on http://127.0.0.1:${PORT}`);
});
