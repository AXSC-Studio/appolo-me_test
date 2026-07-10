import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  root: "apps/web",
  server: {
    port: Math.floor(Math.random() * 9000) + 1000,
    strictPort: false,
  },
});
