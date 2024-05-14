import dotenv from 'dotenv';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import path from 'node:path'

dotenv.config();

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    open: 'auth/login' 
  },
  resolve:{
    alias: {
      '@assets': path.resolve(__dirname, './assets'), 
    }
  },
  plugins: [react()],
  // base: 'auth/login'
  define: {
    global: {},
    'process.env': process.env
  },
  css: {
    modules: {
      localsConvention: 'camelCase',
    }
  }
})
