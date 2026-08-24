"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

/** Subscribe to browser connectivity changes. */
function subscribeOnline(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}

/** Subscribe to standalone display-mode changes (i.e. launched as an app). */
function subscribeStandalone(callback: () => void) {
  const query = window.matchMedia("(display-mode: standalone)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
}

export function InstallPWA() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [justInstalled, setJustInstalled] = useState(false);

  // External browser state is read through useSyncExternalStore so it stays
  // consistent during hydration and never needs setState inside an effect.
  const online = useSyncExternalStore(
    subscribeOnline,
    () => navigator.onLine,
    () => true,
  );

  const standalone = useSyncExternalStore(
    subscribeStandalone,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false,
  );

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setJustInstalled(true);
      setDeferred(null);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const installed = standalone || justInstalled;

  const install = useCallback(async () => {
    if (!deferred) return;
    await deferred.prompt();
    await deferred.userChoice;
    setDeferred(null);
  }, [deferred]);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] ${
            online
              ? "border-emerald-400/30 bg-emerald-500/10 text-emerald-200"
              : "border-amber-400/30 bg-amber-500/10 text-amber-200"
          }`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${online ? "bg-emerald-400" : "bg-amber-400"}`} />
          {online ? "Online" : "Offline — engine still running"}
        </span>
        {installed && (
          <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-[11px] text-indigo-200">
            Installed as app
          </span>
        )}
      </div>

      <h3 className="mt-4 text-lg font-semibold text-white">Install for offline use</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-400">
        Sketch3D installs as a Progressive Web App. Once installed, the editor, the tracing engine, viewport drawing
        and all exporters keep working with no internet connection at all.
      </p>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={install}
          disabled={!deferred || installed}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {installed ? "Already installed" : deferred ? "Install Sketch3D app" : "Use browser menu → Install"}
        </button>
      </div>

      <p className="mt-3 text-xs text-slate-500">
        iPhone / iPad: tap <b>Share</b> → <b>Add to Home Screen</b>. Android: <b>⋮</b> → <b>Install app</b>.
        Desktop Chrome/Edge: the install icon in the address bar.
      </p>
    </div>
  );
}
