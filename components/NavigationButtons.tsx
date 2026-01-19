"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // ajuste path
import { Check } from "lucide-react";

type Props = {
  isTransitioning: boolean;
  isLastQuestion: boolean;
  answered: boolean;
  currentIndex: number; // ðŸ‘ˆ novo
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
        className="flex-1 bg-muted text-foreground hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed font-semibold py-3 rounded-lg transition border border-border"
      >
        {currentIndex === 0 ? "← Voltar ao início" : "← Anterior"}
      </Button>


      <Button
        onClick={onNext}
        disabled={!answered || isTransitioning}
        className="flex-1 bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-accent disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition border-0"
      >
        
        {isLastQuestion ? <div className="flex flex-row items-center gap-1">Finalizar<Check></Check></div> : "Próximo →"}
      </Button>
    </div>
  );
}


