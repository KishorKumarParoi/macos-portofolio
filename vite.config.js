import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "#/src/components": resolve(__dirname, "src/components"),
      "#/src/constants": resolve(__dirname, "src/constants"),
      "#/src/store": resolve(__dirname, "src/store"),
      "#/src/hoc": resolve(__dirname, "src/hoc"),
      "#/src/assets": resolve(__dirname, "src/assets"),
      "#/src/windows": resolve(__dirname, "src/windows"),
      "#components": resolve(__dirname, "src/components"),
      "#constants": resolve(__dirname, "src/constants"),
      "#store": resolve(__dirname, "src/store"),
    },
  },
});
