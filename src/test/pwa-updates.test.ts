import { afterEach, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

it("checks for updates and reloads once when a different release takes control", async () => {
  const initial = { postMessage: vi.fn() };
  const next = { postMessage: vi.fn() };
  const reload = vi.fn();
  const update = vi.fn().mockResolvedValue(undefined);
  const workers = Object.assign(new EventTarget(), {
    controller: initial,
    register: vi.fn().mockResolvedValue({ update }),
  });
  const app = Object.assign(new EventTarget(), { setInterval, clearInterval });
  vi.stubGlobal("__SPIDY_RELEASE__", "release-1");
  vi.stubGlobal("navigator", { serviceWorker: workers, onLine: true });
  vi.stubGlobal("document", Object.assign(new EventTarget(), { visibilityState: "visible" }));
  vi.stubGlobal("window", app);
  vi.stubGlobal("location", { reload });
  vi.stubEnv("DEV", false);

  const { startPwaUpdates } = await import("../lib/pwa");
  const stop = startPwaUpdates();
  const releaseMessage = (source: typeof initial, release: string) =>
    workers.dispatchEvent(
      Object.assign(new Event("message"), { source, data: { type: "spidy:release", release } }),
    );
  try {
    expect(workers.register).toHaveBeenCalledWith("/sw.js", { updateViaCache: "none" });
    await vi.waitFor(() => expect(update).toHaveBeenCalledTimes(1));
    app.dispatchEvent(new Event("online"));
    expect(update).toHaveBeenCalledTimes(2);
    expect(initial.postMessage).toHaveBeenCalledWith("spidy:get-release");
    releaseMessage(initial, "release-1");
    expect(reload).not.toHaveBeenCalled();

    workers.controller = next;
    workers.dispatchEvent(new Event("controllerchange"));
    expect(next.postMessage).toHaveBeenCalledWith("spidy:get-release");
    releaseMessage(initial, "release-2");
    expect(reload).not.toHaveBeenCalled();
    releaseMessage(next, "release-2");
    releaseMessage(next, "release-2");
    expect(reload).toHaveBeenCalledTimes(1);
  } finally {
    stop?.();
  }
});
