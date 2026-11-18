import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  // Tailwind CSS v4 runs as a Vite plugin: no PostCSS / Autoprefixer configuration needed.
  // Its configuration lives in src/index.css (`@import "tailwindcss"` + `@theme`).
  plugins: [react(), tailwindcss()],
});
