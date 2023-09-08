/* eslint-disable no-undef */
import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/'),
      components: path.resolve(__dirname, './src/components/'),
      containers: path.resolve(__dirname, './src/containers/'),
      constants: path.resolve(__dirname, './src/constants/'),
      utils: path.resolve(__dirname, './src/utils/'),
      contexts: path.resolve(__dirname, './src/contexts/'),
    },
  },
  server: {
    watch: {
      usePolling: true,
    },
    host: true, // needed for the Docker Container port mapping to work
    strictPort: true,
    port: 4174, // you can replace this port with any port
  },
});
