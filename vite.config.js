import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'website',
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3030',
        changeOrigin: true,
        secure: false
      },
      '/dsh': {
        target: 'http://127.0.0.1:3080',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/dsh/, '')
      }
    }
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
});
