import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const publicEnv = loadEnv(mode, fileURLToPath(new URL('../../', import.meta.url)), 'NEXT_PUBLIC_');

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    define: {
      'import.meta.env.VITE_SUPABASE_URL': JSON.stringify(publicEnv.NEXT_PUBLIC_SUPABASE_URL ?? ''),
      'import.meta.env.VITE_SUPABASE_ANON_KEY': JSON.stringify(publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''),
    },
  };
});
