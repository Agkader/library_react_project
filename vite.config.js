import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
// Configuration de Vitest pour les tests
  test: {
    globals: true,            // Permet d'utiliser expect, describe, it sans import
    environment: 'jsdom',     // Simule un navigateur (indispensable pour React)
    setupFiles: './src/setup.js', // Charge les outils jest-dom avant les tests
    css: true,
  },
})
