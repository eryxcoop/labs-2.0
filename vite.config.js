import { defineConfig } from 'vite'

console.log(process.env.NODE_ENV);

// https://vitejs.dev/config/
export default defineConfig({
    base: process.env.NODE_ENV === 'production' ? '/labs-2.0/' : './',
})