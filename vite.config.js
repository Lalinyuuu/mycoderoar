import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic'
  }), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(path.dirname(fileURLToPath(import.meta.url)), "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Vendor chunks
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'react-vendor';
            }
            if (id.includes('react-router')) {
              return 'router-vendor';
            }
            if (id.includes('chart.js') || id.includes('react-chartjs-2')) {
              return 'charts-vendor';
            }
            if (id.includes('jspdf') || id.includes('xlsx')) {
              return 'export-vendor';
            }
            if (id.includes('lucide-react') || id.includes('sonner')) {
              return 'ui-vendor';
            }
            if (id.includes('axios') || id.includes('date-fns') || id.includes('lodash')) {
              return 'utils-vendor';
            }
            return 'vendor';
          }
          
          // Admin Statistics components
          if (id.includes('AdminStatistics')) {
            return 'admin-statistics';
          }
          if (id.includes('statistics/PlatformOverview') || id.includes('statistics/UserAnalytics') || 
              id.includes('statistics/PostPerformance') || id.includes('statistics/EngagementTrends')) {
            return 'statistics-components';
          }
          if (id.includes('charts/InteractiveChart')) {
            return 'charts-components';
          }
          if (id.includes('export/ExportButton') || id.includes('realtime/RealTimeStatus')) {
            return 'admin-tools';
          }
        }
      }
    },
    chunkSizeWarningLimit: 500,
    target: 'esnext',
    minify: 'esbuild',
  },
  esbuild: {
    drop: ['console', 'debugger'],
  },
  optimizeDeps: {
    include: ['react', 'react-dom']
  }
})