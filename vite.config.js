import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "./",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./tests/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      exclude: [
        "src/main.jsx",   // ya lo excluiste
        "tests/**",       // excluye todos los archivos de pruebas
        "vite.config.js", // excluye configuración de Vite
        "eslint.config.js",
      ],
    },
  },
});
