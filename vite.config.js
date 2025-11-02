import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
const repoName = "/cia-lpdb/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
});
