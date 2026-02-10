import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        port: 5173,
        proxy: {
            // Forward any request starting with /api to the backend
            '/api': {
                // If your backend is at http://localhost:8081/mojefinance
                target: 'http://localhost:8081/mojefinance',

                // OR if your backend is just http://localhost:8081
                // target: 'http://localhost:8081',

                changeOrigin: true,
                secure: false,

                // Optional: If your backend doesn't expect '/api' in the path, remove it:
                // rewrite: (path) => path.replace(/^\/api/, '')
            }
        }
    }
})