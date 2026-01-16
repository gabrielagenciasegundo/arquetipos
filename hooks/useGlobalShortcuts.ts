"use client";

import { useEffect } from "react";
import { LIKERT_1_5_OPTIONS } from "@/lib/quiz";
import type { Question } from "@/lib/quiz";

type Params = {
  enabled: boolean;
  isInitialPhase: boolean;
  question: Question;
  onPrevious: () => void;
  onNext: () => void;
  onSelectLikert: (option: string) => void; // seleciona e auto-avança
};

export function useGlobalShortcuts({
  enabled,
  isInitialPhase,
  question,
  onPrevious,
  onNext,
  onSelectLikert,
}: Params) {
  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isTypingField =
        tag === "input" || tag === "textarea" || (target as any)?.isContentEditable;

      if (!isTypingField && e.key === "Backspace") {
        e.preventDefault();
        onPrevious();
        return;
      }

      if (!isTypingField && e.key === "Enter") {
        e.preventDefault();
        onNext();
        return;
      }

      const isArchetypeLikert =
        !isInitialPhase &&
        question.type === "radio" &&
        question.options === LIKERT_1_5_OPTIONS;

      if (isArchetypeLikert && e.key >= "1" && e.key <= "5") {
        e.preventDefault();
        const idx = Number(e.key) - 1;
        onSelectLikert(LIKERT_1_5_OPTIONS[idx]);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    enabled,
    isInitialPhase,
    question.id,
    question.type,
    question.options,
    onPrevious,
    onNext,
    onSelectLikert,
  ]);
}
