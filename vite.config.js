import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      // هذا الإعداد سيجعل أي طلب يبدأ بـ /api يذهب تلقائياً للرابط الجديد
      '/api': {
        target: 'https://mango-attendant-handyman.ngrok-free.dev',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})