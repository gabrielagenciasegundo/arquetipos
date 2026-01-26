export interface ArchetypeData {
  id: string;
  name: string;
  description: string;
  focus: string;
  questions: number[];
  color: string;
}

export const ARCHETYPES: ArchetypeData[] = [
  {
    id: "innocent",
    name: "Inocente",
    description: "Otimista, confiante e seguro",
    focus: "Segurança, otimismo e confiança.",
    questions: [5, 13, 34, 49, 63, 65],
    color: "#FFD700",
  },
  {
    id: "orphan",
    name: "Homem-Comum",
    description: "Realista e pertencente",
    focus: "Realismo, pertencimento e superação de abandono.",
    questions: [14, 22, 27, 30, 50, 71],
    color: "#87CEEB",
  },
  {
    id: "warrior",
    name: "Herói",
    description: "Disciplinado e corajoso",
    focus: "Disciplina, coragem e superação de desafios.",
    questions: [6, 39, 40, 44, 57, 59],
    color: "#FF6347",
  },
  {
    id: "caregiver",
    name: "Cuidador",
    description: "Generoso e prestativo",
    focus: "Cuidar dos outros, generosidade e sacrifício.",
    questions: [7, 10, 15, 24, 55, 68],
    color: "#FF69B4",
  },
  {
    id: "explorer",
    name: "Explorador",
    description: "Livre e independente",
    focus: "Liberdade, busca por algo melhor e independência.",
    questions: [33, 47, 51, 62, 70, 72],
    color: "#32CD32",
  },
  {
    id: "lover",
    name: "Amante",
    description: "Apaixonado e intímo",
    focus: "Intimidade, paixão e relacionamentos.",
    questions: [12, 16, 17, 25, 29, 45],
    color: "#FF1493",
  },
  {
    id: "outlaw",
    name: "Fora da Lei",
    description: "Rebelde e transformador",
    focus: "Ruptura, mudança radical e questionamento de regras.",
    questions: [2, 4, 21, 52, 61, 66],
    color: "#9932CC",
  },
  {
    id: "creator",
    name: "Criador",
    description: "Inovador e criativo",
    focus: "Inovação, expressão da visão e criatividade.",
    questions: [8, 19, 31, 60, 64, 69],
    color: "#FF8C00",
  },
  {
    id: "magician",
    name: "Mago",
    description: "Transformador e intuitivo",
    focus: "Transformação, intuição e compreensão de leis invisíveis.",
    questions: [3, 23, 37, 42, 48, 58],
    color: "#4169E1",
  },
  {
    id: "ruler",
    name: "Governante",
    description: "Líder e responsável",
    focus: "Liderança, controle e responsabilidade pelo bem geral.",
    questions: [26, 32, 35, 38, 46, 67],
    color: "#DAA520",
  },
  {
    id: "sage",
    name: "Sábio",
    description: "Analítico e sábio",
    focus: "Conhecimento, verdade e análise racional.",
    questions: [1, 18, 20, 36, 41, 56],
    color: "#A9A9A9",
  },
  {
    id: "jester",
    name: "Bobo",
    description: "Alegre e divertido",
    focus: "Alegria, viver o momento e humor.",
    questions: [9, 11, 28, 43, 53, 54],
    color: "#00CED1",
  },
];

export interface ArchetypeScore {
  archetype: ArchetypeData;
  score: number;
  percentage: number;
}

export function calculateArchetypeScores(
  answers: Record<string, string>
): ArchetypeScore[] {
  const getLikert = (id: string) => {
    const v = answers[id];
    const n = Number(v);
    // esperado: "1".."5"
    if (!Number.isFinite(n)) return 0;
    // clamp de segurança (caso venha lixo)
    if (n < 1) return 0;
    if (n > 5) return 5;
    return n;
  };

  const scores = ARCHETYPES.map((archetype) => {
    const total = archetype.questions.reduce((sum, questionNum) => {
      const questionId = `q${questionNum}`;
      return sum + getLikert(questionId);
    }, 0);

    const maxScore = archetype.questions.length * 5; // robusto
    const percentage = maxScore > 0 ? (total / maxScore) * 100 : 0;

    return {
      archetype,
      score: total,
      percentage,
    };
  });

  return scores.sort((a, b) => b.score - a.score);
}

export function getTopArchetypes(
  scores: ArchetypeScore[],
  count: number = 3
): ArchetypeScore[] {
  return scores.slice(0, count);
}

