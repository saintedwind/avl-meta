
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // <-- use -swc here
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { "@": path.resolve(__dirname, "./src") },
  },
});
