"use client";

import { useState } from "react";

export function NewsletterForm({ source = "footer" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const json = await res.json();
      if (json.ok) {
        setState("done");
        setMessage("You're on the list. Welcome aboard!");
        setEmail("");
      } else {
        setState("error");
        setMessage(json.error ?? "Something went wrong.");
      }
    } catch {
      setState("error");
      setMessage("Network unavailable — try again when online.");
    }
  };

  return (
    <form onSubmit={submit} className="w-full">
      <label className="mb-2 block text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        Product updates
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@studio.com"
          className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20 disabled:opacity-50"
        >
          {state === "loading" ? "…" : "Subscribe"}
        </button>
      </div>
      {message && (
        <p className={`mt-2 text-xs ${state === "error" ? "text-rose-300" : "text-emerald-300"}`}>{message}</p>
      )}
    </form>
  );
}
