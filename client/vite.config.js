import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: "https://mern-chat-app-g9l8.onrender.com:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
