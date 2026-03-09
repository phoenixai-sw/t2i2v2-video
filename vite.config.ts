import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            // @google/genai tries to import some node-specific libraries even in the browser
            // Mocking gifshot to an empty module to prevent rollup build errors
            'gifshot': '/src/empty.js',
        }
    }
})
