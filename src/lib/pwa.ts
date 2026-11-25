declare const __SPIDY_RELEASE__: string;

export const pwaRelease = typeof __SPIDY_RELEASE__ === "string" ? __SPIDY_RELEASE__ : undefined;

const WORKER_URL = "/sw.js";
const CHECK_INTERVAL_MS = 5 * 60_000;
const RESUME_THROTTLE_MS = 1_000;

export function startPwaUpdates() {
  if (!("serviceWorker" in navigator)) return;
  const workers = navigator.serviceWorker;

  if (import.meta.env.DEV) {
    void workers
      .getRegistration("/")
      .then(async (registration) => {
        if (registration?.active?.scriptURL === new URL(WORKER_URL, location.origin).href) {
          await registration.unregister();
        }
      })
      .catch(() => {});
    return;
  }

  let registration: ServiceWorkerRegistration | undefined;
  let checking = false;
  let reloading = false;
  let lastCheck = -Infinity;

  const receiveRelease = (event: MessageEvent) => {
    if (event.source !== workers.controller || event.data?.type !== "spidy:release") return;
    if (!reloading && pwaRelease && event.data.release !== pwaRelease) {
      reloading = true;
      location.reload();
    }
  };

  const askController = () => workers.controller?.postMessage("spidy:get-release");

  const check = async () => {
    if (checking || reloading || !navigator.onLine || document.visibilityState === "hidden") return;
    checking = true;
    lastCheck = Date.now();
    try {
      if (registration) {
        await registration.update();
      } else {
        registration = await workers.register(WORKER_URL, { updateViaCache: "none" });
        await registration.update();
      }
    } catch {
      // Keep the active version and try again when the app is resumed or reconnects.
    } finally {
      checking = false;
    }
  };

  const resume = () => {
    if (document.visibilityState === "hidden") return;
    askController();
    if (Date.now() - lastCheck >= RESUME_THROTTLE_MS) void check();
  };
  const reconnect = () => void check();

  workers.addEventListener("message", receiveRelease);
  workers.addEventListener("controllerchange", askController);
  document.addEventListener("visibilitychange", resume);
  window.addEventListener("pageshow", resume);
  window.addEventListener("focus", resume);
  window.addEventListener("online", reconnect);
  const timer = window.setInterval(resume, CHECK_INTERVAL_MS);
  resume();

  return () => {
    workers.removeEventListener("message", receiveRelease);
    workers.removeEventListener("controllerchange", askController);
    document.removeEventListener("visibilitychange", resume);
    window.removeEventListener("pageshow", resume);
    window.removeEventListener("focus", resume);
    window.removeEventListener("online", reconnect);
    window.clearInterval(timer);
  };
}
