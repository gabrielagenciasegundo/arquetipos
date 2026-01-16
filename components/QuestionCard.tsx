"use client";

import React from "react";
import type { Question } from "@/lib/quiz";
import { LIKERT_1_5 } from "@/lib/quiz";
import { Option } from "@/lib/quiz";
import { maskPhoneInput } from "@/components/utils/phone"; // ajuste path
// Se seu utils/phone está em outro lugar, corrija o import.

type Props = {
  question: Question;
  value: string | undefined;
  inputRef: React.RefObject<HTMLInputElement>;
  fieldError?: string;
  isTransitioning: boolean;
  transitionDir: "next" | "prev";
  onChange: (value: string) => void;
  onSelectRadio: (value: string, autoAdvance: boolean) => void;
  onInputEnter: () => void;
};

function isObjectOption(opt: Option): opt is { value: string; label: string } {
  return typeof opt === "object" && opt !== null && "value" in opt && "label" in opt;
}

function isLikertOptions(options: readonly Option[] | undefined) {
  return options === LIKERT_1_5;
}

export default function QuestionCard({
  question,
  value,
  inputRef,
  fieldError,
  isTransitioning,
  transitionDir,
  onChange,
  onSelectRadio,
  onInputEnter,
}: Props) {
  const containerClass = [
    "transition-all duration-200 will-change-transform",
    isTransitioning
      ? transitionDir === "next"
        ? "opacity-0 translate-y-4"
        : "opacity-0 -translate-y-4"
      : "opacity-100 translate-y-0",
  ].join(" ");

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onInputEnter();
    }
  };

  return (
    <div key={question.id} className={containerClass}>
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-border dark:border-slate-700 space-y-6">
        <h2 className="text-xl md:text-2xl font-semibold text-foreground dark:text-slate-100 leading-relaxed">
          {question.label}
        </h2>

        {question.type === "text" && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="Digite sua resposta"
              className="w-full px-4 py-3 border-2 border-border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172516] dark:focus:ring-green-400 focus:border-transparent transition"
            />
            {fieldError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span>⚠️</span> {fieldError}
              </p>
            )}
          </div>
        )}

        {question.type === "email" && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="email"
              value={value ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleInputKeyDown}
              placeholder="seu@email.com"
              className="w-full px-4 py-3 border-2 border-border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172516] dark:focus:ring-green-400 focus:border-transparent transition"
            />
            {fieldError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span>⚠️</span> {fieldError}
              </p>
            )}
          </div>
        )}

        {question.type === "tel" && (
          <div className="space-y-3">
            <input
              ref={inputRef}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={value ?? "+55 "}
              onChange={(e) => onChange(maskPhoneInput(e.target.value))}
              onKeyDown={handleInputKeyDown}
              placeholder="+55 (11) 99999-9999"
              className="w-full px-4 py-3 border-2 border-border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172516] dark:focus:ring-green-400 focus:border-transparent transition"
            />
            {fieldError && (
              <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                <span>⚠️</span> {fieldError}
              </p>
            )}
          </div>
        )}

        {question.type === "date" && (
          <input
            ref={inputRef}
            type="date"
            value={value ?? ""}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="w-full px-4 py-3 border-2 border-border dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#172516] dark:focus:ring-green-400 focus:border-transparent transition"
          />
        )}

        {question.type === "radio" && question.options && (
          <div className="space-y-2">
            {question.options.map((opt) => {
              const { value: optValue, label: optLabel } = isObjectOption(opt)
                ? opt
                : { value: String(opt), label: String(opt) };

              const isLikert = isLikertOptions(question.options);
              const selected = value === optValue;

              return (
                <label
                  key={optValue}
                  className="flex items-center gap-4 cursor-pointer p-4 border-2 border-border dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/50 transition group"
                >
                  {/* input real (acessível) */}
                  <input
                    type="radio"
                    name={question.id}
                    value={optValue}
                    checked={selected}
                    onChange={(e) => onSelectRadio(e.target.value, isLikert)}
                    className="sr-only"
                  />

                 

                  {/* Número (somente Likert) */}
                  {isLikert && (
                    <span
                      className={[
                        "inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm transition",
                        selected
                          ? "bg-[#172516] text-white dark:bg-green-400 dark:text-slate-950"
                          : "bg-slate-100 text-foreground dark:bg-slate-800 dark:text-slate-100",
                      ].join(" ")}
                    >
                      {optValue}
                    </span>
                  )}

                  {/* Texto fora */}
                  <span className="text-foreground dark:text-slate-300 group-hover:text-[#172516] dark:group-hover:text-green-400 transition">
                    {optLabel}
                  </span>
                </label>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
