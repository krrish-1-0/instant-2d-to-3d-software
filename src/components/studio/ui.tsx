"use client";

import type { ReactNode } from "react";

export function Section({ title, children, defaultOpen = true }: { title: string; children: ReactNode; defaultOpen?: boolean }) {
  return (
    <details open={defaultOpen} className="group border-b border-white/10">
      <summary className="flex cursor-pointer select-none items-center justify-between px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300 hover:bg-white/5">
        {title}
        <span className="text-slate-500 transition-transform group-open:rotate-90">▶</span>
      </summary>
      <div className="space-y-2.5 px-3 pb-3 pt-1">{children}</div>
    </details>
  );
}

export function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <span className="w-20 shrink-0 text-slate-400">{label}</span>
      <div className="flex-1">{children}</div>
    </label>
  );
}

export function NumberField({
  value,
  onChange,
  step = 0.1,
  min,
  max,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
}) {
  return (
    <input
      type="number"
      value={Number.isFinite(value) ? Number(value.toFixed(4)) : 0}
      step={step}
      min={min}
      max={max}
      onChange={(e) => {
        const v = parseFloat(e.target.value);
        onChange(Number.isFinite(v) ? v : 0);
      }}
      className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-xs text-slate-100 outline-none focus:border-indigo-400"
    />
  );
}

export function Vector3Field({
  value,
  onChange,
  step = 0.1,
}: {
  value: [number, number, number];
  onChange: (v: [number, number, number]) => void;
  step?: number;
}) {
  return (
    <div className="grid grid-cols-3 gap-1">
      {(["X", "Y", "Z"] as const).map((axis, i) => (
        <input
          key={axis}
          type="number"
          step={step}
          value={Number(value[i].toFixed(3))}
          onChange={(e) => {
            const v = [...value] as [number, number, number];
            const parsed = parseFloat(e.target.value);
            v[i] = Number.isFinite(parsed) ? parsed : 0;
            onChange(v);
          }}
          className="w-full rounded border border-white/10 bg-black/30 px-1.5 py-1 text-center text-[11px] text-slate-100 outline-none focus:border-indigo-400"
        />
      ))}
    </div>
  );
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step = 0.01,
  suffix = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  suffix?: string;
}) {
  return (
    <div className="text-xs text-slate-300">
      <div className="mb-1 flex items-center justify-between">
        <span className="text-slate-400">{label}</span>
        <span className="font-mono text-[11px] text-slate-200">
          {value.toFixed(step < 1 ? 2 : 0)}
          {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full accent-indigo-400"
      />
    </div>
  );
}

export function ColorField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-7 w-9 cursor-pointer rounded border border-white/10 bg-transparent"
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-white/10 bg-black/30 px-2 py-1 text-xs uppercase text-slate-100 outline-none focus:border-indigo-400"
      />
    </div>
  );
}

export function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 text-xs text-slate-300">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-3.5 w-3.5 accent-indigo-400"
      />
      {label}
    </label>
  );
}

export function Button({
  children,
  onClick,
  variant = "ghost",
  title,
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: "ghost" | "primary" | "danger";
  title?: string;
  disabled?: boolean;
  className?: string;
}) {
  const base = "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed";
  const styles = {
    ghost: "bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10",
    primary: "bg-indigo-500 hover:bg-indigo-400 text-white",
    danger: "bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 border border-rose-500/30",
  } as const;
  return (
    <button title={title} disabled={disabled} onClick={onClick} className={`${base} ${styles[variant]} ${className}`}>
      {children}
    </button>
  );
}
