import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve, join } from 'path';

/** Vite + react-router: GitHub project Pages need a subpath; Hugging Face Space and local dev use `/`. */
function appBaseFromEnv(viteBase: string | undefined) {
  if (viteBase === undefined || viteBase === "" || viteBase === "/") return "/";
  let s = viteBase.trim();
  if (!s.startsWith("/")) s = `/${s}`;
  if (!s.endsWith("/")) s = `${s}/`;
  return s;
}

// Copy index.html → 404.html for GitHub Pages SPA fallback
function copy404Plugin() {
  return {
    name: 'copy-404',
    closeBundle() {
      const outDir = resolve(__dirname, 'docs');
      copyFileSync(join(outDir, 'index.html'), join(outDir, '404.html'));
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  // Shell/CI (e.g. GitHub Actions) must override .env* for per-target `base`
  const viteBase = process.env.VITE_BASE ?? env.VITE_BASE;
  const base = appBaseFromEnv(viteBase);

  return {
    base,
    plugins: [react(), copy404Plugin()],
    root: ".",
    publicDir: "public",
    build: {
      outDir: "docs",
      sourcemap: true,
      rollupOptions: {
        input: {
          main: resolve(__dirname, "index.html"),
        },
        output: {
          entryFileNames: "assets/[name]-[hash].js",
          chunkFileNames: "assets/[name]-[hash].js",
          assetFileNames: "assets/[name]-[hash].[ext]",
          manualChunks: {
            vendor: ["react", "react-dom", "react-router-dom"],
          },
        },
      },
    },
    server: {
      port: 3000,
      open: true,
    },
    preview: {
      port: 3000,
      open: true,
    },
  };
});
