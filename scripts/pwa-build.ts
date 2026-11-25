import { createHash } from "node:crypto";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";
import type { Plugin } from "vite";

function integrity(content: string | Uint8Array) {
  return "sha256-" + createHash("sha256").update(content).digest("base64");
}

export function pwaBuild(release: string): Plugin {
  return {
    name: "spidy-pwa",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "client",
    generateBundle: {
      order: "post",
      async handler(_options, bundle) {
        const { root, publicDir } = this.environment.config;
        const [worker, publicFiles] = await Promise.all([
          readFile(resolve(root, "scripts/service-worker.js"), "utf8"),
          readdir(publicDir, { withFileTypes: true }),
        ]);
        const assets = Object.values(bundle)
          .filter((file) => /\.(?:js|css|woff2?)$/.test(file.fileName))
          .map((file) => ({
            url: "/" + file.fileName,
            integrity: integrity(file.type === "chunk" ? file.code : file.source),
            mutable: false,
          }));
        for (const file of publicFiles) {
          if (!file.isFile() || file.name.startsWith(".") || file.name.startsWith("_")) continue;
          assets.push({
            url: "/" + file.name,
            integrity: integrity(await readFile(resolve(publicDir, file.name))),
            mutable: true,
          });
        }
        this.emitFile({
          type: "asset",
          fileName: "sw.js",
          source: `const RELEASE = ${JSON.stringify(release)};\nconst ASSETS = ${JSON.stringify(assets)};\n${worker}`,
        });
      },
    },
  };
}
