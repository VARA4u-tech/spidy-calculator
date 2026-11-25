import assert from "node:assert/strict";
import { spawn, execFileSync } from "node:child_process";
import vm from "node:vm";

const origin = "http://127.0.0.1:4317";
const legacy = "spidy-calculator-v1";
const existing = new Map([
  [legacy, new Map()],
  ["unrelated-cache", new Map()],
]);
let online = true;
let rejectAsset = false;
let navigations = 0;
const requestKey = (request) => new URL(request.url ?? request, origin).href;
const fromCache = (stored) => stored && new Response(stored.body, stored.options);
const network = (input, options) => {
  if (!online) throw new Error("offline");
  if (rejectAsset && input.url?.endsWith("/logo.png"))
    return new Response("broken", { status: 503 });
  return fetch(input, options);
};
const caches = {
  keys: async () => [...existing.keys()],
  delete: async (name) => existing.delete(name),
  match: async (request, options) =>
    fromCache(existing.get(options.cacheName)?.get(requestKey(request))),
  open: async (name) => {
    if (!existing.has(name)) existing.set(name, new Map());
    const stored = existing.get(name);
    return {
      addAll: async (requests) => {
        const entries = await Promise.all(
          requests.map(async (request) => {
            const response = await network(request);
            assert.equal(response.ok, true, request.url);
            const body = await response.arrayBuffer();
            return [
              request.url,
              { body, options: { status: response.status, headers: response.headers } },
            ];
          }),
        );
        for (const [url, response] of entries) stored.set(url, response);
      },
      match: async (request) => fromCache(stored.get(requestKey(request))),
    };
  },
};

function loadWorker(code) {
  const handlers = new Map();
  let installed = false;
  let claimed = false;
  vm.runInNewContext(code, {
    self: {
      location: new URL(origin),
      addEventListener: (type, listener) => handlers.set(type, listener),
      skipWaiting: async () => {
        installed = true;
      },
      clients: {
        claim: async () => {
          claimed = true;
        },
        matchAll: async () => [
          {
            url: origin + "/calculator?category=everyday&mode=ring",
            navigate: async () => {
              navigations++;
            },
          },
        ],
      },
    },
    caches,
    fetch: network,
    Request: class extends Request {
      constructor(url, options) {
        super(new URL(url, origin), options);
      }
    },
    URL,
    Response,
    AbortController,
    setTimeout,
    clearTimeout,
  });
  return {
    async install() {
      await new Promise((resolve, reject) =>
        handlers.get("install")({ waitUntil: (promise) => promise.then(resolve, reject) }),
      );
      assert(installed);
    },
    async activate() {
      await new Promise((resolve, reject) =>
        handlers.get("activate")({ waitUntil: (promise) => promise.then(resolve, reject) }),
      );
      assert(claimed);
    },
    fetch(path, mode, destination, headers = {}) {
      return new Promise((resolve, reject) => {
        const request = new Request(origin + path, { headers });
        Object.defineProperties(request, {
          mode: { value: mode },
          destination: { value: destination },
        });
        handlers.get("fetch")({ request, respondWith: (promise) => promise.then(resolve, reject) });
      });
    },
  };
}

let previous;
for (let generation = 1; generation <= 3; generation++) {
  execFileSync(
    process.execPath,
    ["node_modules/vite/bin/vite.js", "build", "--logLevel", "error"],
    {
      env: { ...process.env, NITRO_PRESET: "node-server" },
      stdio: "inherit",
    },
  );
  const server = spawn(process.execPath, [".output/server/index.mjs"], {
    env: { ...process.env, NITRO_PORT: "4317", NITRO_HOST: "127.0.0.1" },
    stdio: ["ignore", "pipe", "inherit"],
  });
  try {
    await new Promise((resolve, reject) => {
      server.stdout.once("data", resolve);
      server.once("exit", (status) => reject(Error("Server exited: " + status)));
    });
    const workerResponse = await fetch(origin + "/sw.js");
    assert.equal(workerResponse.headers.get("cache-control"), "no-store");
    const code = await workerResponse.text();
    const release = /^const RELEASE = "([^"]+)"/.exec(code)[1];
    const chunk = JSON.parse(code.split("\n")[1].slice("const ASSETS = ".length, -1))
      .filter((asset) => !asset.mutable && asset.url.endsWith(".js"))
      .find((asset) => asset.url.includes("/index-")).url;
    const worker = loadWorker(code);
    if (previous) {
      assert.notEqual(previous.release, release);
      assert(
        (await (await previous.worker.fetch("/", "navigate")).text()).includes(previous.release),
      );
      rejectAsset = true;
      await assert.rejects(worker.install());
      assert(!existing.has("spidy-calculator-" + release));
      assert(existing.has("spidy-calculator-" + previous.release));
      rejectAsset = false;
    }
    await worker.install();
    await worker.activate();
    assert.equal(navigations, 1);
    assert.equal(existing.has(legacy), false);
    assert(existing.has("unrelated-cache"));
    assert(existing.size <= 3);
    for (const connected of [true, false]) {
      online = connected;
      for (const path of ["/", "/calculator?category=everyday&mode=ring", "/privacy", "/terms"]) {
        const html = await (await worker.fetch(path, "navigate")).text();
        assert(html.includes(release), path);
      }
      assert((await worker.fetch(chunk, "same-origin", "script")).ok);
      assert.equal(
        (
          await worker.fetch("/spidermansound.mp3", "same-origin", "audio", {
            range: "bytes=0-99",
          })
        ).status,
        206,
      );
      if (previous) assert((await worker.fetch(previous.chunk, "same-origin", "script")).ok);
    }
    online = true;
    previous = { release, worker, chunk };
    console.log(`Release ${generation} passed: ${release}`);
  } finally {
    const exited = new Promise((resolve) => server.once("exit", resolve));
    server.kill();
    if (server.exitCode === null) await exited;
  }
}
