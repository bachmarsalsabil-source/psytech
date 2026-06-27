import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    build: {
      chunkSizeWarningLimit: 600,
      cssMinify: true,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('recharts') || id.includes('d3-')) return 'charts';
              if (id.includes('socket.io')) return 'socket';
              if (id.includes('motion') || id.includes('framer-motion')) return 'motion';
              if (id.includes('lucide-react')) return 'icons';
              if (id.includes('@google/genai')) return 'genai';
              if (id.includes('react-hot-toast')) return 'toast';
              if (id.includes('react-dom') || id.includes('react-router')) return 'react-vendor';
            }
            if (id.includes('/src/components/layout/')) return 'layout';
            if (id.includes('/src/pages/LandingPage')) return 'landing';
          },
        },
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
