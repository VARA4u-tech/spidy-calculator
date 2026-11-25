const CACHE_PREFIX = "spidy-calculator-";
const CACHE_NAME = CACHE_PREFIX + RELEASE;
const DOCUMENTS = new Set(["/", "/calculator", "/terms", "/privacy"]);
const ASSET_URLS = new Set(ASSETS.map(({ url }) => url));
const IMMUTABLE_DIRS = new Set(
  ASSETS.filter(({ mutable }) => !mutable).map(({ url }) => url.slice(0, url.lastIndexOf("/") + 1)),
);
const LEGACY_CACHE = "spidy-calculator-v1";

function isReleaseDocument(response, html) {
  return (
    response.ok &&
    !response.redirected &&
    response.headers.get("content-type")?.includes("text/html") &&
    html.includes(`<html lang="en" data-spidy-release="${RELEASE}"`)
  );
}

async function installRelease() {
  const cache = await caches.open(CACHE_NAME);
  try {
    await cache.addAll([
      ...Array.from(DOCUMENTS, (url) => new Request(url, { cache: "no-store", redirect: "error" })),
      ...ASSETS.map(
        ({ url, integrity, mutable }) =>
          new Request(url, { integrity, cache: mutable ? "reload" : "default", redirect: "error" }),
      ),
    ]);
    for (const url of DOCUMENTS) {
      const response = await cache.match(url);
      if (!response || !isReleaseDocument(response, await response.text())) {
        throw new Error(`Offline document ${url} does not match release ${RELEASE}`);
      }
    }
  } catch (error) {
    await caches.delete(CACHE_NAME);
    throw error;
  }
  await self.skipWaiting();
}

self.addEventListener("install", (event) => event.waitUntil(installRelease()));

async function activateRelease() {
  const names = await caches.keys();
  const older = names.filter((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME);
  // Keep one prior build for hashed chunks that an open page may still be loading.
  const previous = [...older].reverse().find((name) => name !== LEGACY_CACHE);
  await Promise.all(older.filter((name) => name !== previous).map((name) => caches.delete(name)));
  await self.clients.claim();

  // The original PWA has no controllerchange listener. Migrate its open windows once.
  if (names.includes(LEGACY_CACHE)) {
    for (const client of await self.clients.matchAll({ type: "window" })) {
      const path = new URL(client.url).pathname.replace(/\/$/, "") || "/";
      if (DOCUMENTS.has(path)) {
        // The navigation can only finish after this activation event releases fetch events.
        void client.navigate(client.url).catch(() => {});
      }
    }
  }
}

self.addEventListener("activate", (event) => event.waitUntil(activateRelease()));

self.addEventListener("message", (event) => {
  if (event.data === "spidy:get-release") {
    event.source?.postMessage({ type: "spidy:release", release: RELEASE });
  }
});

async function navigate(request, path) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4500);
  try {
    const response = await fetch(request, { cache: "no-store", signal: controller.signal });
    if (isReleaseDocument(response, await response.clone().text())) return response;
  } catch {
    // A failed connection falls back to the last complete release.
  } finally {
    clearTimeout(timeout);
  }
  const cache = await caches.open(CACHE_NAME);
  return (await cache.match(path)) ?? Response.error();
}

async function serveAsset(request, path) {
  const cache = await caches.open(CACHE_NAME);
  const response = await cache.match(path);
  if (!response) return fetch(request);

  const range = request.headers.get("range");
  if (!range) return response;
  const match = /^bytes=(\d*)-(\d*)$/.exec(range);
  if (!match || (!match[1] && !match[2])) return fetch(request);

  const body = await response.arrayBuffer();
  const size = body.byteLength;
  const start = match[1] ? Number(match[1]) : Math.max(0, size - Number(match[2]));
  const end = match[1] && match[2] ? Math.min(size - 1, Number(match[2])) : size - 1;
  if (start > end) {
    return new Response(null, { status: 416, headers: { "Content-Range": `bytes */${size}` } });
  }
  return new Response(body.slice(start, end + 1), {
    status: 206,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/octet-stream",
      "Content-Range": `bytes ${start}-${end}/${size}`,
      "Content-Length": String(end - start + 1),
    },
  });
}

async function servePreviousChunk(request) {
  const names = await caches.keys();
  const currentIndex = names.indexOf(CACHE_NAME);
  const previous = names
    .slice(0, Math.max(0, currentIndex))
    .reverse()
    .find((name) => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME && name !== LEGACY_CACHE);
  if (previous) {
    // Do not open a cache here. It may have been deleted by another activation.
    const cached = await caches.match(request, { cacheName: previous });
    if (cached) return cached;
  }
  return fetch(request);
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    const path = url.pathname.replace(/\/$/, "") || "/";
    if (DOCUMENTS.has(path)) event.respondWith(navigate(request, path));
  } else if (ASSET_URLS.has(url.pathname) && !url.search) {
    event.respondWith(serveAsset(request, url.pathname));
  } else if (
    !url.search &&
    ["script", "style", "font"].includes(request.destination) &&
    IMMUTABLE_DIRS.has(url.pathname.slice(0, url.pathname.lastIndexOf("/") + 1))
  ) {
    event.respondWith(servePreviousChunk(request));
  }
});
