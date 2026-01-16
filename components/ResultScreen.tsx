"use client";

import { Button } from "./ui/button";
import { ArchetypeScore, getTopArchetypes } from "./utils/archetypes";
import { useEffect, useState } from "react";

interface ResultScreenProps {
  scores: ArchetypeScore[];
  personalData: {
    nome: string;
    email: string;
    Whatsapp: string;
  };
  onRestart: () => void;
}

export default function ResultScreen({
  scores,
  personalData,
  onRestart,
}: ResultScreenProps) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setIsDark(isDarkMode);

    const observer = new MutationObserver(() => {
      const isNowDark = document.documentElement.classList.contains("dark");
      setIsDark(isNowDark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const topThree = getTopArchetypes(scores, 3);
  const dominant = topThree[0];
  const secondary = topThree[1];
  const tertiary = topThree[2];

  const maxScore = Math.max(...scores.map((s) => s.score));

  const handleDownload = () => {
    const resultText = `
╔════════════════════════════════════════════════════════════╗
║          ANÁLISE DE ARQUÉTIPOS PESSOAIS - RESULTADO        ║
╚════════════════════════════════════════════════════════════╝

📋 DADOS PESSOAIS:
─────────────────────────────────────────────────────────────
   Nome: ${personalData.nome}
   Email: ${personalData.email}
   WhatsApp: ${personalData.Whatsapp}

👑 ARQUÉTIPO DOMINANTE:
─────────────────────────────────────────────────────────────
   ${dominant.archetype.name}
   Pontuação: ${dominant.score}/30 (${dominant.percentage.toFixed(1)}%)
   
   Descrição:
   ${dominant.archetype.description}
   
   Foco: ${dominant.archetype.focus}

⭐ ARQUÉTIPO SECUNDÁRIO:
─────────────────────────────────────────────────────────────
   ${secondary.archetype.name}
   Pontuação: ${secondary.score}/30 (${secondary.percentage.toFixed(1)}%)
   
   Descrição:
   ${secondary.archetype.description}

✨ ARQUÉTIPO TERCIÁRIO:
─────────────────────────────────────────────────────────────
   ${tertiary.archetype.name}
   Pontuação: ${tertiary.score}/30 (${tertiary.percentage.toFixed(1)}%)
   
   Descrição:
   ${tertiary.archetype.description}

📊 TODOS OS ARQUÉTIPOS:
─────────────────────────────────────────────────────────────
${scores.map((s, i) => `   ${i + 1}. ${s.archetype.name.padEnd(30)} ${s.score}/30 (${s.percentage.toFixed(1)}%)`).join("\n")}

═══════════════════════════════════════════════════════════════
   Gerado em: ${new Date().toLocaleString("pt-BR")}
═══════════════════════════════════════════════════════════════
    `.trim();

    const element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(resultText)
    );
    element.setAttribute("download", `resultado-arquetipos-${Date.now()}.txt`);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen w-full bg-background text-foreground dark:bg-slate-950 dark:text-slate-100">
      {/* Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-50 dark:bg-green-950/20 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-green-100 dark:bg-green-900/10 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="relative z-10 flex flex-col items-center sm:px-6 lg:px-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="w-full text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#172516] to-[#36432c] dark:from-green-300 dark:to-green-100 bg-clip-text text-transparent">
            Seus Resultados
          </h1>
          <p className="text-lg text-muted-foreground">
            Análise completa do seu perfil de arquétipos pessoais
          </p>
          <div className="flex justify-center gap-3 mt-4">
            <div className="px-3 py-1 rounded-full bg-[#172516]/10 dark:bg-green-500/20 text-[#172516] dark:text-green-300 text-sm font-semibold">
              {personalData.nome}
            </div>
          </div>
        </div>

        {/* Top 3 Arquétipos */}
        <div className="w-full grid gap-8 mb-12">
          {/* Dominante */}
          <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-[#172516] to-[#36432c] rounded-2xl blur-lg opacity-70 group-hover:opacity-100 transition duration-300" />
            <div className="relative bg-white dark:bg-slate-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition duration-300">
              <div className="h-24 bg-gradient-to-r from-[#172516] to-[#36432c] p-6 flex items-center justify-between">
                <div>
                  <div className="text-white text-sm font-semibold opacity-90">ARQUÉTIPO DOMINANTE</div>
                  <h2 className="text-3xl md:text-4xl font-bold text-white">
                    {dominant.archetype.name}
                  </h2>
                </div>

              </div>

              <div className="p-8 space-y-6">
                <div>
                  <p className="text-foreground dark:text-slate-300 leading-relaxed">
                    <span className="font-semibold text-[#172516] dark:text-green-400">Descrição:</span> {dominant.archetype.description}
                  </p>
                  <p className="text-foreground dark:text-slate-300 mt-4">
                    <span className="font-semibold text-[#172516] dark:text-green-400">Foco principal:</span> {dominant.archetype.focus}
                  </p>
                </div>

                <div className="space-y-3 pt-6 border-t border-border dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground dark:text-slate-200">Pontuação</span>
                    <span className="text-3xl font-bold text-[#172516] dark:text-green-400">
                      {dominant.score} <span className="text-lg text-muted-foreground">/ 30</span>
                    </span>
                  </div>

                  <div className="w-full h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#172516] to-[#36432c] transition-all duration-500 rounded-full"
                      style={{ width: `${dominant.percentage}%` }}
                    />
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <span className="text-sm text-muted-foreground">Desenvolvimento</span>
                    <span className="text-lg font-bold text-[#172516] dark:text-green-400">
                      {dominant.percentage.toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Secundário */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition duration-300 border border-border dark:border-slate-700">
              <div className="h-16 bg-linear-to-r from-[#36432c] to-[#4a5e40] p-4 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">{secondary.archetype.name}</h2>
                <span className="text-3xl opacity-30">2º</span>
              </div>

              <div className="p-6 space-y-4">
                <p className="text-foreground dark:text-slate-300">
                  {secondary.archetype.description}
                </p>

                <div className="space-y-3 pt-4 border-t border-border dark:border-slate-700">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-foreground dark:text-slate-200">Pontuação</span>
                    <span className="text-2xl font-bold text-[#36432c] dark:text-green-300">
                      {secondary.score} <span className="text-sm text-muted-foreground">/ 30</span>
                    </span>
                  </div>

                  <div className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-linear-to-r from-[#36432c] to-[#4a5e40] transition-all duration-500 rounded-full"
                      style={{ width: `${secondary.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Terciário */}
          <div className="relative">
            <div className="bg-white dark:bg-slate-900 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition duration-300 border border-border dark:border-slate-700">
              <div className="h-14 bg-gradient-r from-[#4a5e40] to-[#5e7852] p-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary dark:text-white">{tertiary.archetype.name}</h2>
                <span className="text-2xl opacity-30">3º</span>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-sm text-foreground dark:text-slate-300">
                  {tertiary.archetype.description}
                </p>

                <div className="flex justify-between items-center pt-3 border-t border-border dark:border-slate-700">
                  <span className="text-sm font-semibold text-foreground dark:text-slate-200">Pontuação</span>
                  <span className="font-bold text-[#4a5e40] dark:text-green-200">
                    {tertiary.score} <span className="text-xs text-muted-foreground">/ 30</span>
                  </span>
                </div>

                <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-linear-to-r from-[#36432c] to-[#4a5e40] transition-all duration-500 rounded-full"
                    style={{ width: `${tertiary.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ranking Completo */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-xl shadow-lg p-8 mb-12 border border-border dark:border-slate-700">
          <h3 className="text-2xl font-bold text-foreground dark:text-slate-100 mb-8">
            📊 Ranking Completo de Arquétipos
          </h3>

          <div className="space-y-3">
            {scores.map((score, index) => (
              <div
                key={score.archetype.id}
                className="group relative rounded-lg bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition duration-200 border border-border dark:border-slate-700 p-4"
              >
                {/* Linha 1: número + nome */}
                <div className="flex items-start gap-4 min-w-0">
                  <div className="shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#172516] to-[#36432c] flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1 self-center">
                    <p className="font-semibold text-foreground dark:text-slate-100 truncate">
                      {score.archetype.name}
                    </p>
                  </div>

                  {/* Placar (no mobile pode ir pra baixo; no desktop fica na direita) */}
                  <div className="shrink-0 hidden sm:block text-right">
                    <span className="font-bold text-[#172516] dark:text-green-400 text-lg">
                      {score.score}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">/ 30</span>
                  </div>
                </div>

                {/* Linha 2: barra + placar no mobile */}
                <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-full sm:w-48 h-2.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#172516] to-[#36432c] transition-all duration-500"
                      style={{ width: `${score.percentage}%` }}
                    />
                  </div>

                  <div className="sm:hidden text-right">
                    <span className="font-bold text-[#172516] dark:text-green-400">
                      {score.score}
                    </span>
                    <span className="text-muted-foreground text-sm ml-1">/ 30</span>
                  </div>
                </div>
              </div>
            ))}

          </div>
        </div>

        {/* Interpretação */}
        <div className="w-full bg-gradient-to-br from-[#172516] to-[#36432c] rounded-xl p-8 mb-12 text-white shadow-lg">
          <h3 className="text-2xl font-bold mb-6">🎯 O que significa seu resultado?</h3>

          <div className="space-y-4">
            <p className="leading-relaxed text-lg">
              Seu arquétipo dominante é <span className="font-bold">{dominant.archetype.name}</span>, o que significa que
              você possui uma forte tendência para <span className="font-bold">{dominant.archetype.focus.toLowerCase()}</span>. Este é o seu principal driver comportamental e motivacional.
            </p>

            <p className="leading-relaxed text-lg">
              A combinação com os arquétipos secundário (<span className="font-bold">{secondary.archetype.name}</span>) e terciário (
              <span className="font-bold">{tertiary.archetype.name}</span>) cria um perfil único que o torna versátil e capaz de se adaptar a diferentes situações.
            </p>

            <p className="leading-relaxed text-lg">
              Essa análise pode ser valiosa para autoconhecimento, desenvolvimento pessoal, alinhamento de carreira e relacionamentos interpessoais.
            </p>
          </div>
        </div>

        {/* Informações de Contato */}
        <div className="w-full bg-white dark:bg-slate-900 rounded-lg p-6 mb-12 border-l-4 border-[#172516] dark:border-green-400 shadow-md">
          <h3 className="text-lg font-bold text-foreground dark:text-slate-100 mb-4">✉️ Seus Dados Pessoais</h3>
          <div className="grid gap-3 text-sm">
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">Nome:</span>
              <span className="text-foreground dark:text-slate-300">{personalData.nome}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">Email:</span>
              <span className="text-foreground dark:text-slate-300">{personalData.email}</span>
            </p>
            <p className="flex justify-between">
              <span className="font-semibold text-muted-foreground">WhatsApp:</span>
              <span className="text-foreground dark:text-slate-300">{personalData.Whatsapp}</span>
            </p>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="w-full flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-gradient-to-r from-[#172516] to-[#36432c] hover:from-[#0f1812] hover:to-[#2a3220] text-white font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-0"
          >
            📥 Baixar Resultado (TXT)
          </Button>

          <Button
            onClick={onRestart}
            className="flex-1 bg-slate-200 dark:bg-slate-800 text-[#172516] dark:text-green-300 hover:bg-slate-300 dark:hover:bg-slate-700 font-bold py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition duration-300 cursor-pointer border-2 border-[#172516] dark:border-green-400"
          >
            🔄 Refazer o Teste
          </Button>
        </div>
      </div>
    </div>
  );
}
