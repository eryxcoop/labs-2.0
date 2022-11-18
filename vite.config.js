import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/labs-2.0/' : './',
})