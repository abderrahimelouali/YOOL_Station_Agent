import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    root: 'renderer',
    base: './', // Important for Electron file:// protocol
    build: {
        outDir: '../dist/renderer',
        emptyOutDir: true
    },
    server: {
        port: 5174,
        strictPort: true,
        host: '127.0.0.1', 
        hmr: {
            protocol: 'ws',
            host: '127.0.0.1',
            port: 5174,
        }, 
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
