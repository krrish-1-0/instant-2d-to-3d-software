"use client";

import Link from "next/link";
import { useState } from "react";

const PLANS = [
  {
    name: "Free",
    monthly: 0,
    yearly: 0,
    tagline: "Everything you need to model solo.",
    features: [
      "Unlimited instant 2D → 3D conversions",
      "Full offline browser engine",
      "Draw in the 3D viewport & primitives",
      "GLB / OBJ / STL export",
      "3 cloud-saved projects",
      "Local browser backups",
    ],
    cta: "Start modeling",
    highlight: false,
  },
  {
    name: "Pro",
    monthly: 19,
    yearly: 15,
    tagline: "For freelancers shipping client work.",
    features: [
      "Everything in Free",
      "Unlimited cloud projects",
      "Public gallery publishing",
      "Material preset library",
      "High-resolution tracing (up to 240px field)",
      "Priority email support",
    ],
    cta: "Start 14-day trial",
    highlight: true,
  },
  {
    name: "Studio",
    monthly: 59,
    yearly: 49,
    tagline: "For teams and production pipelines.",
    features: [
      "Everything in Pro",
      "REST API access & webhooks",
      "Shared team workspaces",
      "Self-hosted offline deployment",
      "SSO & audit logs",
      "Dedicated onboarding engineer",
    ],
    cta: "Talk to sales",
    highlight: false,
  },
];

export function PricingTable() {
  const [yearly, setYearly] = useState(true);

  return (
    <div>
      <div className="mb-10 flex items-center justify-center gap-3">
        <span className={`text-sm ${!yearly ? "text-white" : "text-slate-500"}`}>Monthly</span>
        <button
          onClick={() => setYearly((v) => !v)}
          className="relative h-6 w-12 rounded-full border border-white/15 bg-white/10 transition"
          aria-label="Toggle billing period"
        >
          <span
            className={`absolute top-0.5 h-4.5 w-5 rounded-full bg-gradient-to-r from-indigo-400 to-fuchsia-400 transition-all ${
              yearly ? "left-6" : "left-0.5"
            }`}
            style={{ height: 18, width: 20 }}
          />
        </button>
        <span className={`text-sm ${yearly ? "text-white" : "text-slate-500"}`}>
          Yearly <span className="text-emerald-300">−20%</span>
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const price = yearly ? plan.yearly : plan.monthly;
          return (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                plan.highlight
                  ? "border-indigo-400/40 bg-gradient-to-b from-indigo-500/10 to-transparent shadow-xl shadow-indigo-500/10"
                  : "border-white/10 bg-white/[0.02]"
              }`}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                  Most popular
                </span>
              )}
              <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
              <p className="mt-1 text-xs text-slate-400">{plan.tagline}</p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-bold text-white">${price}</span>
                <span className="mb-1.5 text-xs text-slate-500">/ month</span>
              </div>
              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-300">
                    <span className="mt-0.5 text-emerald-400">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={plan.name === "Studio" ? "/contact" : "/studio"}
                className={`mt-6 rounded-xl px-4 py-3 text-center text-sm font-semibold transition ${
                  plan.highlight
                    ? "bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:brightness-110"
                    : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}
