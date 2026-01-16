"use client";

import { useEffect, useState } from "react";
import type { PersistedQuizState } from "@/lib/quiz";

const fallback: PersistedQuizState = {
  currentIndex: 0,
  showInstructions: true,
  showResults: false,
  resultsSent: false,
  answers: {},
};

function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(min, n), max);
}

export function usePersistedQuizState(storageKey: string, maxIndex: number) {
  const [hydrated, setHydrated] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(fallback.currentIndex);
  const [showInstructions, setShowInstructions] = useState(fallback.showInstructions);
  const [showResults, setShowResults] = useState(fallback.showResults);
  const [resultsSent, setResultsSent] = useState(fallback.resultsSent);
  const [answers, setAnswers] = useState<Record<string, string>>(fallback.answers);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as Partial<PersistedQuizState>;

      const idx = typeof parsed.currentIndex === "number" ? parsed.currentIndex : 0;
      setCurrentIndex(clamp(idx, 0, maxIndex));

      if (typeof parsed.showInstructions === "boolean") setShowInstructions(parsed.showInstructions);
      if (typeof parsed.showResults === "boolean") setShowResults(parsed.showResults);
      if (typeof parsed.resultsSent === "boolean") setResultsSent(parsed.resultsSent);
      if (parsed.answers && typeof parsed.answers === "object") setAnswers(parsed.answers as Record<string, string>);
    } catch {
      // ignora
    } finally {
      setHydrated(true);
    }
  }, [storageKey, maxIndex]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const payload: PersistedQuizState = {
        currentIndex,
        showInstructions,
        showResults,
        resultsSent,
        answers,
      };
      localStorage.setItem(storageKey, JSON.stringify(payload));
    } catch {}
  }, [hydrated, storageKey, currentIndex, showInstructions, showResults, resultsSent, answers]);

  const clear = () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  };

  return {
    hydrated,
    currentIndex,
    setCurrentIndex,
    showInstructions,
    setShowInstructions,
    showResults,
    setShowResults,
    resultsSent,
    setResultsSent,
    answers,
    setAnswers,
    clear,
  };
}
