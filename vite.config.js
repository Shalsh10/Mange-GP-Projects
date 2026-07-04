import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // هذا الإعداد سيجعل أي طلب يبدأ بـ /api يذهب تلقائياً للرابط الجديد
      '/api': {
        target: 'https://d97c-154-183-132-96.ngrok-free.app',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})