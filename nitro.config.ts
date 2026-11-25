import { defineConfig } from "nitro";

const revalidate = { headers: { "cache-control": "no-cache" } };

export default defineConfig({
  routeRules: {
    "/": revalidate,
    "/calculator": revalidate,
    "/terms": revalidate,
    "/privacy": revalidate,
    "/manifest.webmanifest": revalidate,
    "/favicon.ico": revalidate,
    "/footer-image.jpg": revalidate,
    "/icon-192.png": revalidate,
    "/icon-512.png": revalidate,
    "/logo.png": revalidate,
    "/spidermansound.mp3": revalidate,
    "/sw.js": { headers: { "cache-control": "no-store" } },
  },
});
