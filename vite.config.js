import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import readableArchivePlugin from './scripts/readableArchivePlugin.js';

export default defineConfig({
  plugins: [react(), readableArchivePlugin()],
  // Relative assets also work under a GitHub Pages repository subdirectory.
  base: './',
  server: { host: '127.0.0.1' },
  preview: { host: '127.0.0.1' },
});
