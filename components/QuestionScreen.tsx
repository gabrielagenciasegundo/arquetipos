"use client";

import React, { useMemo, useRef } from "react";
import type { Question } from "@/lib/quiz";
import { ARCHETYPE_QUESTIONS, INITIAL_QUESTIONS, LIKERT_1_5_OPTIONS } from "@/lib/quiz";
import ProgressHeader from "@/components/ProgressHeader";
import QuestionCard from "@/components/QuestionCard";
import NavigationButtons from "@/components/NavigationButtons";
import Image from "next/image";

type Props = {
    allQuestions: Question[];
    currentIndex: number;
    answers: Record<string, string>;
    fieldErrors: Record<string, string>;
    isTransitioning: boolean;
    transitionDir: "next" | "prev";
    isLastQuestion: boolean;
    canGoPrev: boolean;
    onPrevious: () => void;
    onNext: () => void;
    onAnswerChange: (value: string) => void;
    onSelectRadio: (value: string, autoAdvance: boolean) => void;
    onInputEnter: () => void;
    inputRefExternal?: React.RefObject<HTMLInputElement>;
};

export default function QuestionScreen({
    allQuestions,
    currentIndex,
    answers,
    fieldErrors,
    isTransitioning,
    transitionDir,
    isLastQuestion,
    canGoPrev,
    onPrevious,
    onNext,
    onAnswerChange,
    onSelectRadio,
    onInputEnter,
    inputRefExternal,
}: Props) {
    const localInputRef = useRef<HTMLInputElement | null>(null);
    const inputRef = inputRefExternal ?? localInputRef;

    const currentQuestion = allQuestions[currentIndex];
    const isInitialPhase = currentIndex < INITIAL_QUESTIONS.length;

    const answered = Boolean(answers[currentQuestion.id]?.trim());

    const archetypeIndex = useMemo(() => {
        if (isInitialPhase) return 0;
        return currentIndex - INITIAL_QUESTIONS.length + 1;
    }, [currentIndex, isInitialPhase]);

    return (
        <div className="flex w-full justify-center items-center">
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-50 dark:bg-green-950/20 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-900/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 w-full md:w-1/2 lg:w-1/3 max-w-2xl">
                <ProgressHeader
                    isInitialPhase={isInitialPhase}
                    currentIndex={currentIndex}
                    total={allQuestions.length}
                    archetypeIndex={Math.max(1, archetypeIndex)}
                    archetypeTotal={ARCHETYPE_QUESTIONS.length}
                />

                <QuestionCard
                    question={currentQuestion}
                    value={answers[currentQuestion.id]}
                    inputRef={inputRef as React.RefObject<HTMLInputElement>}
                    fieldError={fieldErrors[currentQuestion.id]}
                    isTransitioning={isTransitioning}
                    transitionDir={transitionDir}
                    onChange={onAnswerChange}
                    onSelectRadio={onSelectRadio}
                    onInputEnter={onInputEnter}
                />

                <NavigationButtons
                    canGoPrev={canGoPrev}
                    canGoNext={true}
                    isTransitioning={isTransitioning}
                    isLastQuestion={isLastQuestion}
                    answered={answered}
                    onPrevious={onPrevious}
                    onNext={onNext}
                />

                {!isInitialPhase && (
                    <p className="text-xs text-muted-foreground text-center mt-6 opacity-70">
                        💡 Use Backspace para voltar, Enter para avançar, ou 1-5 para responder
                    </p>
                )}
            </div>
        </div>
    );
}
