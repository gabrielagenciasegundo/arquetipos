"use client";

import { useEffect, useRef, useState } from "react";

export function useStepNavigation(transitionMs: number) {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionDir, setTransitionDir] = useState<"next" | "prev">("next");
  const timeoutRef = useRef<number | null>(null);

  const startTransition = (dir: "next" | "prev", onCommit: () => void) => {
    if (isTransitioning) return;

    setTransitionDir(dir);
    setIsTransitioning(true);

    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      onCommit();
      setIsTransitioning(false);
    }, transitionMs);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  return { isTransitioning, transitionDir, startTransition };
}
