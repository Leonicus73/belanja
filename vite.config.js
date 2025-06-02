import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/oneMapProxy": {
        target: "https://www.onemap.gov.sg",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/oneMapProxy/, ""),
        secure: false,
      },
    },
  },
});
