"use client";

import { useState } from "react";

const TOPICS = [
  { value: "general", label: "General question" },
  { value: "sales", label: "Team / enterprise plan" },
  { value: "support", label: "Technical support" },
  { value: "partnership", label: "Partnership" },
  { value: "bug", label: "Bug report" },
];

export function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", company: "", topic: "general", message: "" });
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [feedback, setFeedback] = useState("");

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (json.ok) {
        setState("done");
        setFeedback("Thanks — your message is in. We reply within one business day.");
        setForm({ name: "", email: "", company: "", topic: "general", message: "" });
      } else {
        setState("error");
        setFeedback(json.error ?? "Could not send message.");
      }
    } catch {
      setState("error");
      setFeedback("You appear to be offline. Your message was not sent.");
    }
  };

  const field = "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2.5 text-sm text-white outline-none transition focus:border-indigo-400";

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Full name</label>
          <input required value={form.name} onChange={update("name")} className={field} placeholder="Ada Lovelace" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Work email</label>
          <input required type="email" value={form.email} onChange={update("email")} className={field} placeholder="ada@studio.com" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Company (optional)</label>
          <input value={form.company} onChange={update("company")} className={field} placeholder="Pixel Forge" />
        </div>
        <div>
          <label className="mb-1.5 block text-xs text-slate-400">Topic</label>
          <select value={form.topic} onChange={update("topic")} className={field}>
            {TOPICS.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <label className="mb-1.5 block text-xs text-slate-400">Message</label>
        <textarea
          required
          rows={5}
          value={form.message}
          onChange={update("message")}
          className={field}
          placeholder="Tell us what you're building…"
        />
      </div>
      <button
        type="submit"
        disabled={state === "loading"}
        className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:brightness-110 disabled:opacity-50 sm:w-auto"
      >
        {state === "loading" ? "Sending…" : "Send message"}
      </button>
      {feedback && <p className={`text-xs ${state === "error" ? "text-rose-300" : "text-emerald-300"}`}>{feedback}</p>}
    </form>
  );
}
