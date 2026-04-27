import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { copyFileSync } from 'fs';
import { resolve, join } from 'path';

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
export default defineConfig({
  plugins: [react(), copy404Plugin()],
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'docs',
    sourcemap: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html")
      },
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000,
    open: true
  }
})
