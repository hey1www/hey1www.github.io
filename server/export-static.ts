/**
 * Static export. Writes:
 *   dist-static/index.html
 *   dist-static/data.json
 *   dist-static/assets/...
 *
 * With --single the assets and data are inlined into a single index.html
 * suitable for dropping into any static host.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";
import { validatePortfolio } from "../src/utils/portfolioValidation.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");

const SINGLE = process.argv.includes("--single");

const DATA_FILE = path.join(ROOT, "data", "portfolio.json");
const OUT_DIR = path.join(ROOT, "dist-static");
const BUILD_DIR = path.join(ROOT, "dist");

async function loadData(): Promise<unknown> {
  if (fs.existsSync(DATA_FILE)) {
    const data = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    const result = validatePortfolio(data);
    if (!result.ok) throw new Error(`Invalid ${DATA_FILE}: ${result.errors.join("; ")}`);
    return result.value;
  }
  // Fall back: dynamically import the seed via tsx's loader.
  const url = new URL("../src/data/defaultPortfolio.ts", import.meta.url).href;
  const mod = (await import(url)) as any;
  const data = mod.defaultPortfolio ?? mod.default ?? mod;
  const result = validatePortfolio(data);
  if (!result.ok) throw new Error(`Invalid seed data: ${result.errors.join("; ")}`);
  return result.value;
}

function build() {
  // Re-use the Vite viewer build.
  process.env.VITE_APP_MODE = "viewer";
  // eslint-disable-next-line no-console
  console.log("[export] running vite build…");
  execSync("npx vite build", {
    cwd: ROOT,
    stdio: "inherit",
    env: { ...process.env, VITE_APP_MODE: "viewer" },
  });
}

function rmrf(p: string) {
  if (!fs.existsSync(p)) return;
  fs.rmSync(p, { recursive: true, force: true });
}

function copyDir(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function resolveBuiltAsset(assetUrl: string) {
  const clean = assetUrl.replace(/^\.\//, "").replace(/^\//, "");
  return path.join(BUILD_DIR, clean);
}

function inlineMedia(data: unknown): unknown {
  const copy = JSON.parse(JSON.stringify(data)) as any;
  for (const card of copy.cards ?? []) {
    for (const section of card.details?.sections ?? []) {
      for (const media of section.media ?? []) {
        if (typeof media.src !== "string" || media.src.startsWith("data:")) continue;
        const filePath = resolveBuiltAsset(media.src);
        if (!fs.existsSync(filePath)) continue;
        const extension = path.extname(filePath).toLowerCase();
        const mime = extension === ".webp"
          ? "image/webp"
          : extension === ".jpg" || extension === ".jpeg"
          ? "image/jpeg"
          : "image/png";
        media.src = `data:${mime};base64,${fs.readFileSync(filePath).toString("base64")}`;
      }
    }
  }
  return copy;
}

function inlineAssets(html: string, data: unknown): string {
  let out = html;
  out = out.replace(/<link[^>]+href=["']([^"']+\.css)["'][^>]*>/g, (tag, href: string) => {
    const css = fs.readFileSync(resolveBuiltAsset(href), "utf-8");
    return `<style>${css}</style>`;
  });
  out = out.replace(/<script[^>]+src=["']([^"']+\.js)["'][^>]*><\/script>/g, (_tag, src: string) => {
    return `<script type="module">${fs.readFileSync(resolveBuiltAsset(src), "utf-8")}</script>`;
  });
  // Inject data so the bundled JS can read it synchronously.
  const safeJson = JSON.stringify(data).replace(/</g, "\\u003c");
  out = out.replace(
    "</head>",
    `<script id="heyi-portfolio-data" type="application/json">${safeJson}</script></head>`
  );
  return out;
}

function main() {
  build();
  // Top-level await: data is async.
  loadData().then((data) => {
    rmrf(OUT_DIR);
    fs.mkdirSync(OUT_DIR, { recursive: true });
    if (SINGLE) {
      const htmlPath = path.join(BUILD_DIR, "index.html");
      let html = fs.readFileSync(htmlPath, "utf-8");
      html = inlineAssets(html, inlineMedia(data));
      fs.writeFileSync(path.join(OUT_DIR, "index.html"), html, "utf-8");
    } else {
      copyDir(BUILD_DIR, OUT_DIR);
      fs.writeFileSync(path.join(OUT_DIR, "data.json"), JSON.stringify(data, null, 2), "utf-8");
    }
    // eslint-disable-next-line no-console
    console.log(`[export] done → ${OUT_DIR}${SINGLE ? " (single file)" : ""}`);
  });
}

main();
