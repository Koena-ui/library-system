import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// "/library-system/" is only needed for the GitHub Pages build.
export default defineConfig(({ command }) => ({
  plugins: [react()],
  base: command === "build" ? "/library-system/" : "/",
}));
