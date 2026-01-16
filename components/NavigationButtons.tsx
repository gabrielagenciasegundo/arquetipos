"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // ajuste path

type Props = {
  isTransitioning: boolean;
  isLastQuestion: boolean;
  answered: boolean;
  currentIndex: number; // 👈 novo
  onPrevious: () => void;
  onNext: () => void;
};


export default function NavigationButtons({
  isTransitioning,
  isLastQuestion,
  answered,
  onPrevious,
  onNext,
  currentIndex
}: Props) {
  return (
    <div className="flex gap-3 mt-8">
      <Button
        onClick={onPrevious}
        disabled={isTransitioning}
        className="flex-1 bg-slate-200 dark:bg-slate-800 text-foreground dark:text-slate-100 hover:bg-slate-300 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition border border-border dark:border-slate-600"
      >
        {currentIndex === 0 ? "← Voltar ao início" : "← Anterior"}
      </Button>


      <Button
        onClick={onNext}
        disabled={!answered || isTransitioning}
        className="flex-1 bg-gradient-to-r from-[#172516] to-[#36432c] hover:from-[#0f1812] hover:to-[#2a3220] disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition border-0"
      >
        {isLastQuestion ? "✅ Finalizar" : "Próximo →"}
      </Button>
    </div>
  );
}
