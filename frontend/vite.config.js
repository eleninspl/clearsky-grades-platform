import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Επιτρέπει την πρόσβαση από το Docker
    port: 5173,
    watch: {
      usePolling: true, // Απαραίτητο για hot reload στο Docker
    },
  },
});