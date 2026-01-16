"use client";

import { useEffect } from "react";
import type { Question } from "@/lib/quiz";

export function useAutoFocusInput(
  enabled: boolean,
  question: Question,
  inputRef: React.RefObject<HTMLInputElement | null>
) {
  useEffect(() => {
    if (!enabled) return;

    const isInput =
      question.type === "text" ||
      question.type === "email" ||
      question.type === "tel" ||
      question.type === "date";

    if (!isInput) return;

    const t = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 0);

    return () => window.clearTimeout(t);
  }, [enabled, question.id, question.type, inputRef]);
}
