"use client";

import { useEffect, useState } from "react";
import type { PersistedQuizState } from "@/lib/quiz";

export function usePersistedQuizState(storageKey: string, maxIndex: number) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  // reidrata
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) return;

      const parsed = JSON.parse(raw) as Partial<PersistedQuizState>;
      const idx =
        typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0;

      const safeIndex = Math.min(Math.max(0, idx), maxIndex);

      setCurrentIndex(safeIndex);
      if (typeof parsed.showInstructions === "boolean") setShowInstructions(parsed.showInstructions);
      if (parsed.answers && typeof parsed.answers === "object") setAnswers(parsed.answers);
    } catch {
      // ignora
    }
  }, [storageKey, maxIndex]);

  // autosave
  useEffect(() => {
    try {
      const payload: PersistedQuizState = { currentIndex, showInstructions, answers };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {
      // ignora
    }
  }, [storageKey, currentIndex, showInstructions, answers]);

  const clear = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  return {
    currentIndex,
    setCurrentIndex,
    showInstructions,
    setShowInstructions,
    answers,
    setAnswers,
    clear,
  };
}
