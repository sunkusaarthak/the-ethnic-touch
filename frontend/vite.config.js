import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = (env.VITE_API_BASE_URL || process.env.VITE_API_BASE_URL || '').replace(/\/+$/, '')

  return {
    plugins: [
      react(),
      {
        name: 'sync-admin-env',
        closeBundle() {
          const adminDir = path.resolve(__dirname, 'dist/admin')
          if (fs.existsSync(adminDir)) {
            const envContent = `// Injected from Render Environment Variables during build\nwindow.__ENV__ = {\n  VITE_API_BASE_URL: ${JSON.stringify(apiUrl)}\n};\n`
            fs.writeFileSync(path.join(adminDir, 'env.js'), envContent, 'utf8')
            console.log(`[Vite Plugin] Generated dist/admin/env.js with VITE_API_BASE_URL: "${apiUrl}"`)
          }
        }
      }
    ],
    build: {
      outDir: 'dist',
      emptyOutDir: true
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://[::1]:8080',
          changeOrigin: true
        }
      }
    }
  }
})
