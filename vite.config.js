import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // هذا الإعداد سيجعل أي طلب يبدأ بـ /api يذهب تلقائياً للرابط الجديد
      '/api': {
        target: 'https://1fcb-154-182-18-194.ngrok-free.app/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }
    }
  }
})