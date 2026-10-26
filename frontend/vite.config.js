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
        name: 'sync-admin-api-url',
        closeBundle() {
          if (!apiUrl) return
          const adminJsPath = path.resolve(__dirname, 'dist/admin/admin.js')
          if (fs.existsSync(adminJsPath)) {
            let content = fs.readFileSync(adminJsPath, 'utf8')
            content = content.replace(
              /https:\/\/(the-ethnic-touch-backend|tet-backend-1)\.onrender\.com/g,
              apiUrl
            )
            fs.writeFileSync(adminJsPath, content, 'utf8')
            console.log(`[Vite Plugin] Synchronized admin.js API_BASE_URL with VITE_API_BASE_URL: ${apiUrl}`)
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
