export const INITIAL_QUESTIONS: Question[] = [
  { id: "nome", label: "Nome", type: "text", required: true },
  { id: "Whatsapp", label: "WhatsApp", type: "tel", required: true },
  { id: "email", label: "Endereço de email", type: "email", required: true },
];

export const LIKERT_1_5 = [
  { value: "1", label: "Quase nunca se aplica a mim" },
  { value: "2", label: "Raramente se aplica a mim" },
  { value: "3", label: "Às vezes se aplica a mim" },
  { value: "4", label: "Geralmente se aplica a mim" },
  { value: "5", label: "Quase sempre se aplica a mim" },
] as const;

export type LikertValue = typeof LIKERT_1_5[number]["value"];

export const ARCHETYPE_STATEMENTS = [
  "Eu reúno informações sem formar juízos.",
  "Sinto-me desorientado(a) por causa de tantas mudanças na minha vida.",
  "O processo da minha autocura permite que eu ajude a curar os outros.",
  "Eu humilho os outros.",
  "Sinto-me seguro(a).",
  "Deixo o medo de lado e faço o que precisa ser feito.",
  "Ponho as necessidades dos outros na frente das minhas.",
  "Procuro ser autêntico(a) onde quer que eu esteja.",
  "Quando a vida fica monótona, gosto de fazer uma mudança radical.",
  "Tenho prazer em cuidar das outras pessoas.",
  "Os outros me acham divertido(a).",
  "Sinto-me sexy.",
  "Acredito que as pessoas não querem realmente magoar as outras.",
  "Quando criança, eu era ludibriado(a) ou negligenciado(a).",
  "Gosto mais de dar que de receber.",
  'Concordo com a seguinte afirmação: "É melhor ter amado e perdido o objetivo desse amor do que nunca ter amado".',
  "Vivo a vida plenamente.",
  "Mantenho um senso de perspectiva procurando ter uma visão de longo alcance.",
  "Estou empenhado(a) no processo de criar a minha própria vida.",
  "Acredito que uma mesma coisa pode ser considerada a partir de diferentes ângulos.",
  "Não sou mais a pessoa que pensava ser.",
  "A vida é um rosário de tristezas.",
  "A ajuda espiritual é responsável pela minha eficiência.",
  "Acho mais fácil fazer as coisas para os outros do que para mim mesmo(a).",
  "Encontro satisfação nos meus relacionamentos.",
  "As pessoas me procuram em busca de orientação.",
  "Tenho medo das pessoas que ocupam posições de mando.",
  "Não levo as regras muito a sério.",
  "Gosto de ajudar as pessoas a estabelecerem contato.",
  "Sinto-me abandonado(a).",
  "Às vezes consigo realizar coisas importantes aparentemente sem esforço.",
  "Tenho capacidade de liderança.",
  "Procuro sempre me aperfeiçoar.",
  "Posso contar com outras pessoas para cuidarem de mim.",
  "Prefiro estar no comando das situações.",
  "Procuro descobrir a verdade que está por trás das aparências.",
  "A modificação de meus pensamentos altera a minha vida.",
  "Eu estimulo o desenvolvimento dos recursos, sejam eles humanos ou naturais.",
  "Estou disposto(a) a correr riscos pessoais para defender as idéias nas quais acredito.",
  "Não consigo ficar sentado(a) e deixar que uma injustiça seja cometida sem tentar corrigi-la.",
  "Eu me esforço para ser objetivo(a).",
  "Minha presença muitas vezes atua como um catalisador para a realização de mudanças.",
  "Gosto de fazer as pessoas rirem.",
  "Tenho disciplina para alcançar as minhas metas.",
  "Amo a humanidade como um todo.",
  "Tenho a capacidade de combinar as habilidades das pessoas com as tarefas a serem realizadas.",
  "A manutenção da minha independência é fundamental para mim.",
  "Acredito que todas as pessoas e todas as coisas do mundo estão interligadas.",
  "O mundo é um lugar seguro.",
  "As pessoas em quem confiei me abandonaram.",
  "Sinto certa inquietação.",
  "Estou renunciando às coisas que não servem mais para mim.",
  'Gosto de "alegrar" as pessoas que são excessivamente sérias.',
  "Um pouco de bagunça é bom para a alma.",
  "O fato de ter me sacrificado para ajudar os outros fez de mim uma pessoa melhor.",
  "Sou uma pessoa calma.",
  "Costumo enfrentar as pessoas hostis.",
  "Gosto de transformar as situações.",
  "A chave para o sucesso, em todos os aspectos da vida, é a disciplina.",
  "A inspiração vem facilmente para mim.",
  "Não estou à altura das expectativas que tinha para mim mesmo(a).",
  "Tenho a sensação de que um mundo melhor está à minha espera em algum lugar.",
  "Quando conheço uma pessoa presumo que ela é digna de confiança.",
  "Meus sonhos estão se transformando em realidade.",
  "Sei que as minhas necessidades serão supridas.",
  "Tenho vontade de realizar algum tipo de ruptura.",
  "Procuro administrar as situações tendo em mente o bem geral.",
  "Sinto dificuldade para dizer não.",
  "Tenho mais ideias boas do que tempo para transformá-las em realidade.",
  "Estou procurando melhorar a minha vida.",
  "Tive decepções com pessoas que foram importantes na minha vida.",
  "O ato de procurar alguma coisa é tão importante quanto encontrá-la.",
] as const;

export type Option =
  | { value: string; label: string } // novo
  | string; // compat (se você tiver outros radios simples)

export interface Question {
  id: string;
  label: string;
  type: "text" | "email" | "date" | "tel" | "select" | "radio";
  options?: readonly Option[];
  required?: boolean;
}

export const ARCHETYPE_QUESTIONS: Question[] = ARCHETYPE_STATEMENTS.map((text, i) => ({
  id: `q${i + 1}`,
  label: `${i + 1} - ${text}`,
  type: "radio",
  options: LIKERT_1_5, // agora é array de {value,label}
  required: true,
}));


export const ALL_QUESTIONS: Question[] = [...INITIAL_QUESTIONS, ...ARCHETYPE_QUESTIONS];

export const TRANSITION_MS = 180;

export const STORAGE_KEY = "archetype_test_v2";

export type PersistedQuizState = {
  currentIndex: number;
  showInstructions: boolean;
  showResults: boolean;
  resultsSent: boolean;
  answers: Record<string, string>;
};
