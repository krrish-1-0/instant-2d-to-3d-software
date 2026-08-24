"use client";

import { createContext, useContext, useRef, type RefObject } from "react";

type OrbitControlsLike = { enabled: boolean };

const OrbitControlsContext = createContext<RefObject<OrbitControlsLike | null> | null>(null);

export function OrbitControlsProvider({ children }: { children: React.ReactNode }) {
  const ref = useRef<OrbitControlsLike | null>(null);
  return <OrbitControlsContext.Provider value={ref}>{children}</OrbitControlsContext.Provider>;
}

export function useOrbitControlsRef() {
  const ctx = useContext(OrbitControlsContext);
  if (!ctx) throw new Error("useOrbitControlsRef must be used within OrbitControlsProvider");
  return ctx;
}
