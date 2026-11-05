import { URL, fileURLToPath } from 'node:url';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const host = env.HOST || 'localhost';
  const port = 5173;

  // Прокси /api включается, только если в .env.local задан API_PROXY_TARGET
  const proxy = env.API_PROXY_TARGET
    ? { '/api': { target: env.API_PROXY_TARGET, changeOrigin: true } }
    : undefined;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    server: {
      host,
      port,
      open: process.env.CI ? false : `http://${host}:${port}/`,
      proxy,
    },
  };
});
