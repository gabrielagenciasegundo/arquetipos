"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // ajuste o path se necessário
import Image from "next/image";
type Props = {
    onStart: () => void;
    onClearSaved: () => void;
};

export default function InstructionsScreen({ onStart, onClearSaved }: Props) {
    return (
        <div className="min-h-screen w-full bg-background dark:bg-slate-950 text-foreground dark:text-slate-100 flex flex-col justify-center items-center gap-8 px-4 py-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-green-50 dark:bg-green-950/20 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-900/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 max-w-2xl w-full space-y-8">
                {/* Logo/Título Principal */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-[#172516] to-[#36432c] dark:from-green-300 dark:to-green-100 bg-clip-text text-transparent">
                            Agencia Segundo
                        </h1> */}


                    <h2 className="text-5xl md:text-3xl font-bold bg-linear-to-r from-[#172516] to-[#36432c] dark:from-green-300 dark:to-green-100 bg-clip-text text-transparent">
                        Teste de Arquétipos
                    </h2>
                    <p className="text-lg text-muted-foreground">Descubra seu perfil arquetípico pessoal</p>
                </div>

                {/* Créditos */}
                <div className="bg-white dark:bg-slate-900 rounded-lg p-6 border border-border dark:border-slate-700 shadow-md">
                    <p className="text-center text-sm font-semibold text-[#172516] dark:text-green-400">
                        Propriedade intelectual e autora do teste:{" "}
                        <span className="font-bold">Carol S. Pearson</span>
                    </p>
                </div>

                {/* Instruções */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 border border-border dark:border-slate-700 space-y-6">
                    <h2 className="text-3xl font-bold text-foreground dark:text-slate-100">📋 Instruções</h2>

                    <div className="space-y-4">
                        <p className="text-lg leading-relaxed text-foreground dark:text-slate-300">
                            Indique a frequência com que cada afirmação descreve melhor o seu comportamento.
                            Assinale na frente de cada questão o que melhor o descreve{" "}
                            <span className="font-semibold">neste momento</span>.
                        </p>

                        <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6 space-y-3 border-l-4 border-[#172516] dark:border-green-400">
                            {[
                                ["1", "Quase nunca se aplica a mim", "#172516"],
                                ["2", "Raramente se aplica a mim", "#36432c"],
                                ["3", "Às vezes se aplica a mim", "#4a5e40"],
                                ["4", "Geralmente se aplica a mim", "#5e7852"],
                                ["5", "Quase sempre se aplica a mim", "#72926a"],
                            ].map(([n, txt, _c]) => (
                                <p key={n} className="flex items-center gap-3 text-foreground dark:text-slate-200">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#172516] text-white font-bold text-sm">
                                        {n}
                                    </span>
                                    <span>{txt}</span>
                                </p>
                            ))}
                        </div>

                        <div className="bg-green-50 dark:bg-green-950/20 rounded-lg p-4 border border-green-200 dark:border-green-900/50">
                            <p className="text-sm text-green-900 dark:text-green-100">
                                <span className="font-bold">💡 Dica:</span> Nas perguntas do arquétipo, você pode usar as teclas{" "}
                                <span className="font-mono font-bold">1</span> a{" "}
                                <span className="font-mono font-bold">5</span> para selecionar e avançar automaticamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Informações sobre o teste */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-border dark:border-slate-700 shadow-sm">
                        <div className="text-3xl mb-2">⏱️</div>
                        <p className="text-sm font-semibold text-foreground dark:text-slate-100">~10 min</p>
                        <p className="text-xs text-muted-foreground">Tempo estimado</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-border dark:border-slate-700 shadow-sm">
                        <div className="text-3xl mb-2">📝</div>
                        <p className="text-sm font-semibold text-foreground dark:text-slate-100">75</p>
                        <p className="text-xs text-muted-foreground">Perguntas</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-lg p-4 text-center border border-border dark:border-slate-700 shadow-sm">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-sm font-semibold text-foreground dark:text-slate-100">12</p>
                        <p className="text-xs text-muted-foreground">Arquétipos</p>
                    </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-[#172516] to-[#36432c] hover:from-[#0f1812] hover:to-[#2a3220] text-white font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-0"
                    >
                        ▶️ Começar o Teste
                    </Button>

                    <button
                        type="button"
                        onClick={onClearSaved}
                        className="w-full text-sm text-muted-foreground hover:text-foreground dark:hover:text-slate-300 underline py-2 transition"
                    >
                        Limpar progresso salvo
                    </button>
                </div>
            </div>
        </div>
    );
}
