import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:5001",
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.ico", "lovable-uploads/app-dashboard.png"],
      manifest: {
        name: "AgriLync Field Agent",
        short_name: "AgriLync",
        description: "Field agent tools for grower visits, registration, and rural sync.",
        theme_color: "#065f46",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/dashboard/agent",
        scope: "/",
        categories: ["business", "productivity"],
        icons: [
          {
            src: "/lovable-uploads/app-dashboard.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/lovable-uploads/app-dashboard.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/favicon.ico",
            sizes: "64x64",
            type: "image/x-icon",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,svg,woff2,woff}"],
        globIgnores: ["**/lovable-uploads/image*.png", "**/lovable-uploads/blog*.png", "**/lovable-uploads/farm*.png"],
        maximumFileSizeToCacheInBytes: 5 * 1024 * 1024,
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/api/],
        runtimeCaching: [
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/farmers"),
            handler: "NetworkFirst",
            options: {
              cacheName: "agrilync-farmers-api",
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname.startsWith("/api/field-visits"),
            handler: "NetworkFirst",
            options: {
              cacheName: "agrilync-visits-api",
              networkTimeoutSeconds: 8,
              expiration: { maxEntries: 30, maxAgeSeconds: 60 * 60 * 12 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        // Disabled in dev: workbox-build fails on Node 22+ when bundling SW ("Source phase import").
        // Offline sync (IndexedDB) works without SW; PWA activates on production build.
        enabled: false,
      },
    }),
    mode === "development" && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      sonner: path.resolve(__dirname, "./src/utils/customSonner.ts"),
    },
  },
}));
