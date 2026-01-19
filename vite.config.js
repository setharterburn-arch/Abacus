import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks - split by library
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js'],
          'framer': ['framer-motion'],

          // Heavy utilities
          'html2canvas': ['html2canvas'],
          'dompurify': ['dompurify']
        }
      }
    },
    chunkSizeWarningLimit: 500
  }
})
