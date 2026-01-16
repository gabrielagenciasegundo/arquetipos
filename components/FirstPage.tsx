"use client";

import type { ZodError } from "zod";
import React, { useCallback, useMemo, useRef, useState } from "react";

import { PersonalDataSchema } from "./validation";
import ResultScreen from "./ResultScreen";
import { calculateArchetypeScores } from "./utils/archetypes";

import InstructionsScreen from "@/components/InstructionsScreen";
import QuestionScreen from "@/components/QuestionScreen";

import { ALL_QUESTIONS, INITIAL_QUESTIONS, STORAGE_KEY, TRANSITION_MS } from "@/lib/quiz";

import { usePersistedQuizState } from "@/hooks/usePersistedQuizState";
import { useStepNavigation } from "@/hooks/useStepNavigation";
import { useGlobalShortcuts } from "@/hooks/useGlobalShortcuts";
import { useAutoFocusInput } from "@/hooks/useAutoFocusInput";
import { usePhoneCursorLock } from "@/hooks/usePhoneCursorLock";

export default function FirstPage() {
  const allQuestions = ALL_QUESTIONS;
  const maxIndex = allQuestions.length - 1;

  const {
    currentIndex,
    setCurrentIndex,
    showInstructions,
    setShowInstructions,
    answers,
    setAnswers,
    clear,
  } = usePersistedQuizState(STORAGE_KEY, maxIndex);

  const [showResults, setShowResults] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const { isTransitioning, transitionDir, startTransition } = useStepNavigation(TRANSITION_MS);

  const inputRef = useRef<HTMLInputElement | null>(null);
  const advanceQueuedRef = useRef(false);

  const currentQuestion = allQuestions[currentIndex];
  const isInitialPhase = currentIndex < INITIAL_QUESTIONS.length;
  const isLastQuestion = currentIndex === maxIndex;

  const canGoNext = currentIndex < maxIndex;

  const setZodErrorsToState = useCallback((zodError: ZodError) => {
    const formatted: Record<string, string> = {};
    for (const issue of zodError.issues) {
      const key = String(issue.path?.[0] ?? "");
      if (key) formatted[key] = issue.message;
    }
    setFieldErrors(formatted);
  }, []);

  const PersonalFieldSchemas = useMemo(
    () => ({
      nome: PersonalDataSchema.pick({ nome: true }),
      Whatsapp: PersonalDataSchema.pick({ Whatsapp: true }),
      email: PersonalDataSchema.pick({ email: true }),
    }),
    []
  );

  const clearPersistedAndReset = useCallback(() => {
    clear();
    setCurrentIndex(0);
    setAnswers({});
    setShowInstructions(true);
    setShowResults(false);
    setFieldErrors({});
  }, [clear, setAnswers, setCurrentIndex, setShowInstructions]);

  const handleStart = useCallback(() => {
    setShowInstructions(false);
    setAnswers((prev) => ({
      ...prev,
      Whatsapp: prev.Whatsapp?.trim() ? prev.Whatsapp : "+55 ",
    }));
  }, [setAnswers, setShowInstructions]);

  const handleClearSaved = useCallback(() => {
    clear();
    setAnswers({});
    setCurrentIndex(0);
    setShowInstructions(true);
    setFieldErrors({});
  }, [clear, setAnswers, setCurrentIndex, setShowInstructions]);

  const handleAnswerChange = useCallback(
    (value: string) => {
      setFieldErrors((prev) => {
        const next = { ...prev };
        delete next[currentQuestion.id];
        return next;
      });
      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    },
    [currentQuestion.id, setAnswers]
  );

  const handleBack = useCallback(() => {
    // Caso especial: primeira pergunta → volta para instruções
    if (currentIndex === 0) {
      setShowInstructions(true);
      setShowResults(false);
      setFieldErrors({});
      return;
    }

    // Caso normal: volta uma pergunta
    if (!isTransitioning) {
      startTransition("prev", () =>
        setCurrentIndex((i) => Math.max(0, i - 1))
      );
    }
  }, [
    currentIndex,
    isTransitioning,
    setShowInstructions,
    setShowResults,
    setFieldErrors,
    startTransition,
    setCurrentIndex,
  ]);


  const handleNext = useCallback(() => {
    const value = answers[currentQuestion.id];
    if (!value || !value.trim()) return;

    if (isInitialPhase) {
      const fieldId = currentQuestion.id as keyof typeof PersonalFieldSchemas;
      const schema = PersonalFieldSchemas[fieldId];

      if (schema) {
        const result = schema.safeParse({ [fieldId]: answers[fieldId] ?? "" });
        if (!result.success) {
          setZodErrorsToState(result.error);
          return;
        }
      }
    }

    if (isLastQuestion) {
      setShowResults(true);
      return;
    }

    if (!canGoNext || isTransitioning) return;
    startTransition("next", () => setCurrentIndex((i) => Math.min(maxIndex, i + 1)));
  }, [
    answers,
    currentQuestion.id,
    isInitialPhase,
    isLastQuestion,
    canGoNext,
    isTransitioning,
    maxIndex,
    PersonalFieldSchemas,
    setCurrentIndex,
    setZodErrorsToState,
    startTransition,
  ]);

  const selectAndMaybeAdvance = useCallback(
    (value: string, autoAdvance: boolean) => {
      if (isTransitioning) return;

      setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

      if (autoAdvance && canGoNext && !advanceQueuedRef.current) {
        advanceQueuedRef.current = true;
        window.setTimeout(() => {
          startTransition("next", () =>
            setCurrentIndex((i) => Math.min(maxIndex, i + 1))
          );
          advanceQueuedRef.current = false;
        }, 0);
      }
    },
    [canGoNext, currentQuestion.id, isTransitioning, maxIndex, setAnswers, setCurrentIndex, startTransition]
  );

  useAutoFocusInput(!showInstructions && !showResults, currentQuestion, inputRef);
  usePhoneCursorLock(!showInstructions && !showResults, currentQuestion, inputRef);

  useGlobalShortcuts({
    enabled: !showInstructions && !showResults,
    isInitialPhase,
    question: currentQuestion,
    onPrevious: handleBack, // 👈 aqui
    onNext: handleNext,
    onSelectLikert: (opt) => selectAndMaybeAdvance(opt, true),
  });


  if (showResults) {
    const scores = calculateArchetypeScores(answers);
    return (
      <ResultScreen
        scores={scores}
        personalData={{
          nome: answers.nome || "",
          email: answers.email || "",
          Whatsapp: answers.Whatsapp || "",
        }}
        onRestart={clearPersistedAndReset}
      />
    );
  }

  if (showInstructions) {
    return <InstructionsScreen onStart={handleStart} onClearSaved={handleClearSaved} />;
  }

  return (
    <QuestionScreen
      allQuestions={allQuestions}
      currentIndex={currentIndex}
      answers={answers}
      fieldErrors={fieldErrors}
      isTransitioning={isTransitioning}
      transitionDir={transitionDir}
      isLastQuestion={isLastQuestion}
      onPrevious={handleBack}   // 👈 aqui
      onNext={handleNext}
      onAnswerChange={handleAnswerChange}
      onSelectRadio={(value, autoAdvance) => selectAndMaybeAdvance(value, autoAdvance)}
      onInputEnter={handleNext}
      inputRefExternal={inputRef}
    />

  );

}
