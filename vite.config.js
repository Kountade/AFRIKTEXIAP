import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // Important pour Render
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks: undefined, // Optionnel : pour éviter les erreurs de chunks
      }
    }
  },
  server: {
    port: 3000,
    strictPort: false,
    host: true,
    open: true,
  }
})