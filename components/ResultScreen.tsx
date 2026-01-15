"use client";

import { Button } from "./ui/button";
import { ArchetypeScore, getTopArchetypes } from "./utils/archetypes";

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
  const topThree = getTopArchetypes(scores, 3);
  const dominant = topThree[0];
  const secondary = topThree[1];
  const tertiary = topThree[2];

  const maxScore = Math.max(...scores.map((s) => s.score));

  const handleDownload = () => {
    const resultText = `
Teste de Arquétipos - Resultado
================================

Dados Pessoais:
- Nome: ${personalData.nome}
- Email: ${personalData.email}
- WhatsApp: ${personalData.Whatsapp}

Arquétipo Dominante:
${dominant.archetype.name} (${dominant.score} pontos)
${dominant.archetype.description}

Arquétipo Secundário:
${secondary.archetype.name} (${secondary.score} pontos)
${secondary.archetype.description}

Arquétipo Terciário:
${tertiary.archetype.name} (${tertiary.score} pontos)
${tertiary.archetype.description}

Todos os Arquétipos:
${scores.map((s, i) => `${i + 1}. ${s.archetype.name}: ${s.score} pontos`).join("\n")}
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
    <div className="flex flex-col justify-center items-center min-h-screen gap-8 px-4 bg-gradient-to-b from-blue-50 to-indigo-50">
      <div className="w-full md:w-2/3 lg:w-1/2">
        <h1 className="text-4xl font-bold text-center mb-2">Seus Resultados</h1>
        <p className="text-center text-gray-600 mb-8">
          Análise do seu perfil de arquétipos
        </p>

        {/* Top 3 Arquétipos */}
        <div className="space-y-6 mb-12">
          {/* Dominante */}
          <div className="rounded-lg overflow-hidden shadow-lg border-4 border-yellow-400">
            <div
              className="h-16 flex items-center px-6"
              style={{ backgroundColor: dominant.archetype.color }}
            >
              <div>
                <h2 className="text-2xl font-bold text-white">
                  🏆 Dominante: {dominant.archetype.name}
                </h2>
              </div>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-700 mb-3">
                <strong>Descrição:</strong> {dominant.archetype.description}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Foco:</strong> {dominant.archetype.focus}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Pontuação</span>
                  <span className="text-2xl font-bold">
                    {dominant.score} / 30
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${dominant.percentage}%`,
                      backgroundColor: dominant.archetype.color,
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {dominant.percentage.toFixed(1)}% de desenvolvimento
                </p>
              </div>
            </div>
          </div>

          {/* Secundário */}
          <div className="rounded-lg overflow-hidden shadow-md border-2 border-gray-300">
            <div
              className="h-12 flex items-center px-6"
              style={{ backgroundColor: secondary.archetype.color }}
            >
              <h2 className="text-xl font-bold text-white">
                ⭐ Secundário: {secondary.archetype.name}
              </h2>
            </div>
            <div className="p-4 bg-white">
              <p className="text-gray-700 mb-2">
                {secondary.archetype.description}
              </p>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Pontuação</span>
                  <span className="font-bold">{secondary.score} / 30</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${secondary.percentage}%`,
                      backgroundColor: secondary.archetype.color,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Terciário */}
          <div className="rounded-lg overflow-hidden shadow-sm border-2 border-gray-200">
            <div
              className="h-10 flex items-center px-6"
              style={{ backgroundColor: tertiary.archetype.color }}
            >
              <h2 className="text-lg font-bold text-white">
                ✨ Terciário: {tertiary.archetype.name}
              </h2>
            </div>
            <div className="p-3 bg-white">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-semibold">Pontuação</span>
                <span className="font-bold text-sm">{tertiary.score} / 30</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${tertiary.percentage}%`,
                    backgroundColor: tertiary.archetype.color,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Gráfico de todos os arquétipos */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-6">Todos os Arquétipos</h3>
          <div className="space-y-4">
            {scores.map((score, index) => (
              <div key={score.archetype.id}>
                <div className="flex justify-between items-center mb-1">
                  <span className="font-medium text-sm">
                    {index + 1}. {score.archetype.name}
                  </span>
                  <span className="font-bold text-sm">
                    {score.score} / 30
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="h-full transition-all duration-500 rounded-full"
                    style={{
                      width: `${score.percentage}%`,
                      backgroundColor: score.archetype.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interpretação */}
        <div className="bg-indigo-50 border-l-4 border-indigo-600 p-6 rounded mb-8">
          <h3 className="text-lg font-bold mb-3 text-indigo-900">
            O que significa seu resultado?
          </h3>
          <p className="text-indigo-800 text-sm">
            Seu arquétipo dominante é <strong>{dominant.archetype.name}</strong>
            , o que significa que você possui forte tendência para{" "}
            <strong>{dominant.archetype.focus.toLowerCase()}</strong>
          </p>
          <p className="text-indigo-800 text-sm mt-3">
            A presença dos arquétipos secundário e terciário sugere que você também possui
            características de{" "}
            <strong>
              {secondary.archetype.name.toLowerCase()} e{" "}
              {tertiary.archetype.name.toLowerCase()}
            </strong>
            , criando uma combinação única de personalidade.
          </p>
        </div>

        {/* Botões */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <Button
            onClick={handleDownload}
            className="flex-1 cursor-pointer bg-green-600 hover:bg-green-700"
          >
            📥 Baixar Resultado
          </Button>
          <Button
            onClick={onRestart}
            className="flex-1 cursor-pointer bg-indigo-600 hover:bg-indigo-700"
          >
            🔄 Refazer Teste
          </Button>
        </div>
      </div>
    </div>
  );
}
