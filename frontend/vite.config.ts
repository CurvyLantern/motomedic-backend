import { defineConfig } from "vite";
import Unfonts from "unplugin-fonts/vite";
import react from "@vitejs/plugin-react";
import { URL, fileURLToPath } from "url";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      google: {
        preconnect: true,
        families: [
          {
            name: "Rubik",

            styles: "ital,wght@0,400;0,500;0,600;0,900;1,400",

            defer: true,
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
