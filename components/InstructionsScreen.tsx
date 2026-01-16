"use client";

import React from "react";
import { Button } from "@/components/ui/button"; // ajuste o path se necessÃ¡rio
import Image from "next/image";
type Props = {
    onStart: () => void;
    onClearSaved: () => void;
};

export default function InstructionsScreen({ onStart, onClearSaved }: Props) {
    return (
        <div className="min-h-screen w-full bg-transparent text-foreground flex flex-col justify-center items-center gap-8 px-4 py-12">
            {/* Gradient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-40" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl opacity-30" />
            </div>

            <div className="relative z-10 max-w-2xl w-full space-y-8">
                {/* Logo/TÃ­tulo Principal */}
                <div className="flex flex-col items-center text-center space-y-4">
                    {/* <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Agencia Segundo
                        </h1> */}


                    <h2 className="font-serif text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                        Teste de Arquétipos
                    </h2>
                    <p className="text-2xl text-muted-foreground">Descubra seu perfil arquetípico pessoal</p>
                </div>

                {/* CrÃ©ditos */}
                <div className="bg-card rounded-lg p-6 border border-border shadow-md">
                    <p className="text-center text-sm font-semibold text-primary">
                        Propriedade intelectual e autora do teste:{" "}
                        <span className="font-bold">Carol S. Pearson</span>
                    </p>
                </div>

                {/* InstruÃ§Ãµes */}
                <div className="bg-card rounded-xl shadow-lg p-8 border border-border space-y-6">
                    <h2 className="text-3xl font-bold text-foreground">📋 Instruções</h2>

                    <div className="space-y-4">
                        <p className="text-lg leading-relaxed text-foreground">
                            Indique a frequência com que cada afirmação descreve melhor o seu comportamento.
                            Assinale na frente de cada questão o que melhor o descreve{" "}
                            <span className="font-semibold">neste momento</span>.
                        </p>

                        <div className="bg-muted rounded-lg p-6 space-y-3 border-l-4 border-primary">
                            {[
                                ["1", "Quase nunca se aplica a mim", "#172516"],
                                ["2", "Raramente se aplica a mim", "#36432c"],
                                ["3", "Às vezes se aplica a mim", "#4a5e40"],
                                ["4", "Geralmente se aplica a mim", "#5e7852"],
                                ["5", "Quase sempre se aplica a mim", "#72926a"],
                            ].map(([n, txt, _c]) => (
                                <p key={n} className="flex items-center gap-3 text-foreground">
                                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-bold text-sm">
                                        {n}
                                    </span>
                                    <span>{txt}</span>
                                </p>
                            ))}
                        </div>

                        <div className="bg-primary/10 rounded-lg p-4 border border-accent/40">
                            <p className="text-sm text-foreground">
                                <span className="font-bold">💡 Dica:</span> Nas perguntas do arquétipo, você pode usar as teclas{" "}
                                <span className="font-mono font-bold">1</span> a{" "}
                                <span className="font-mono font-bold">5</span> para selecionar e avançar automaticamente.
                            </p>
                        </div>
                    </div>
                </div>

                {/* InformaÃ§Ãµes sobre o teste */}
                <div className="grid grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-card rounded-lg p-4 text-center border border-border shadow-sm">
                        <div className="text-3xl mb-2">⏱️</div>
                        <p className="text-sm font-semibold text-foreground">~10 min</p>
                        <p className="text-xs text-muted-foreground">Tempo estimado</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center border border-border shadow-sm">
                        <div className="text-3xl mb-2">📝</div>
                        <p className="text-sm font-semibold text-foreground">75</p>
                        <p className="text-xs text-muted-foreground">Perguntas</p>
                    </div>
                    <div className="bg-card rounded-lg p-4 text-center border border-border shadow-sm">
                        <div className="text-3xl mb-2">🎯</div>
                        <p className="text-sm font-semibold text-foreground">12</p>
                        <p className="text-xs text-muted-foreground">Arquétipos</p>
                    </div>
                </div>

                {/* BotÃµes */}
                <div className="flex flex-col gap-4">
                    <Button
                        onClick={onStart}
                        className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary hover:to-accent text-primary-foreground font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-0"
                    >
                        ▶️ Começar o Teste
                    </Button>

                    <button
                        type="button"
                        onClick={onClearSaved}
                        className="w-full text-sm text-muted-foreground hover:text-foreground  underline py-2 transition"
                    >
                        Limpar progresso salvo
                    </button>
                </div>
            </div>
        </div>
    );
}




