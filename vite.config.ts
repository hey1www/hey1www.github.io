import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: process.env.VITE_BASE || "./",
  plugins: [react()],
  define: {
    __APP_MODE__: JSON.stringify(process.env.VITE_APP_MODE || "viewer"),
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
    strictPort: false,
  },
  build: {
    outDir: "dist",
    sourcemap: false,
  },
}));
