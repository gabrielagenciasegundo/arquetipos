"use client";

import React from "react";

type Props = {
  isInitialPhase: boolean;
  currentIndex: number;
  total: number;
  archetypeIndex: number; // 1-based para display
  archetypeTotal: number;
};

export default function ProgressHeader({
  isInitialPhase,
  currentIndex,
  total,
  archetypeIndex,
  archetypeTotal,
}: Props) {
  return (
    <div className="mb-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          {isInitialPhase ? "Dados Pessoais" : "Perguntas"}
        </h1>
        <div className="text-sm font-semibold text-muted-foreground bg-muted px-3 py-1 rounded-full">
          {currentIndex + 1}/{total}
        </div>
      </div>

      <p className="text-muted-foreground text-sm">
        {isInitialPhase
          ? "Comece preenchendo seus dados pessoais"
          : `Pergunta ${archetypeIndex} de ${archetypeTotal}`}
      </p>

      <div className="w-full h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-500 rounded-full"
          style={{ width: `${((currentIndex + 1) / total) * 100}%` }}
        />
      </div>
    </div>
  );
}


