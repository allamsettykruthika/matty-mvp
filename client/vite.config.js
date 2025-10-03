import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // required for Vercel build output
  },
  server: {
    port: 3000, // local dev port
  }
});
