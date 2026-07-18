import { useEffect, useState } from "react";

export type ResponsiveMode = "desktop" | "tablet" | "mobile";

function computeMode(width: number): ResponsiveMode {
  if (width < 768) return "mobile";
  if (width < 900) return "tablet";
  return "desktop";
}

export function useResponsiveMode(): ResponsiveMode {
  const [mode, setMode] = useState<ResponsiveMode>(() => {
    if (typeof window === "undefined") return "desktop";
    return computeMode(window.innerWidth);
  });

  useEffect(() => {
    function onResize() {
      setMode(computeMode(window.innerWidth));
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return mode;
}
