"use client";

import { useEffect } from "react";
import type { Question } from "@/lib/quiz";

export function usePhoneCursorLock(
  enabled: boolean,
  question: Question,
  inputRef: React.RefObject<HTMLInputElement | null>
) {
  useEffect(() => {
    if (!enabled) return;

    const isPhone = question.id === "Whatsapp" && question.type === "tel";
    if (!isPhone) return;

    const el = inputRef.current;
    if (!el) return;

    const t = window.setTimeout(() => {
      const len = el.value.length;
      try {
        el.setSelectionRange(len, len);
      } catch {}
    }, 0);

    return () => window.clearTimeout(t);
  }, [enabled, question.id, question.type, inputRef]);
}
