import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        // 1. Force Vite to listen on all network interfaces (0.0.0.0)
        // Mandatory for Docker accessibility.
        host: true,

        // 2. Set Port to 8080 (Strict ensures it fails if port is busy)
        port: 8080,
        strictPort: true,

        // 3. Enable Polling (Critical for Windows/Docker Hot Reload)
        watch: {
            usePolling: true,
        },
    },
})