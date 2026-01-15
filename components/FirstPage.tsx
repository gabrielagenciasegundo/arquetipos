"use client";
import type { ZodError } from "zod";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "./ui/button";
import { PersonalDataSchema } from "./validation";
import { maskPhoneInput } from "./utils/phone";
import { calculateArchetypeScores } from "./utils/archetypes";
import ResultScreen from "./ResultScreen";

interface Question {
    id: string;
    label: string;
    type: "text" | "email" | "date" | "tel" | "select" | "radio";
    options?: readonly string[];
    required?: boolean;
}

const initialQuestions: Question[] = [
    { id: "nome", label: "Nome", type: "text", required: true },
    { id: "Whatsapp", label: "WhatsApp", type: "tel", required: true },
    { id: "email", label: "Endereço de email", type: "email", required: true },
];

// (mantive seu Likert / statements como estavam)
const LIKERT_1_5_OPTIONS = [
    "1 - Quase nunca se aplica a mim",
    "2 - Raramente aplica-se a mim",
    "3 - Às vezes aplica-se a mim",
    "4 - Geralmente se aplica a mim",
    "5 - Quase sempre se aplica a mim",
] as const;
const archetypeStatements = [
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

const archetypeQuestions: Question[] = archetypeStatements.map((text, i) => ({
    id: `q${i + 1}`,
    label: `${i + 1} - ${text}`,
    type: "radio",
    options: LIKERT_1_5_OPTIONS,
    required: true,
}));

const TRANSITION_MS = 180;

/**
 * Persistência simples no client (localStorage).
 * - Salva automaticamente a cada mudança de answers/currentIndex/showInstructions.
 * - Reidrata ao carregar.
 */
const STORAGE_KEY = "archetype_test_v1";

type PersistedState = {
    currentIndex: number;
    showInstructions: boolean;
    answers: Record<string, string>;
};

export default function FirstPage() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [showInstructions, setShowInstructions] = useState(true);
    const [showResults, setShowResults] = useState(false);

    const [isTransitioning, setIsTransitioning] = useState(false);
    const [transitionDir, setTransitionDir] = useState<"next" | "prev">("next");
    const timeoutRef = useRef<number | null>(null);

    const inputRef = useRef<HTMLInputElement | null>(null);

    const allQuestions = useMemo(() => [...initialQuestions, ...archetypeQuestions], []);
    const currentQuestion = allQuestions[currentIndex];
    const isInitialPhase = currentIndex < initialQuestions.length;
    const isLastQuestion = currentIndex === allQuestions.length - 1;

    const canGoNext = currentIndex < allQuestions.length;
    const canGoPrev = currentIndex > 0;

    // --------- Reidratar do localStorage (persistência client) ---------
    useEffect(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as PersistedState;

            if (typeof parsed.currentIndex === "number") setCurrentIndex(parsed.currentIndex);
            if (typeof parsed.showInstructions === "boolean") setShowInstructions(parsed.showInstructions);
            if (parsed.answers && typeof parsed.answers === "object") setAnswers(parsed.answers);
        } catch {
            // se corromper, ignora e segue
        }
    }, []);

    // --------- Salvar no localStorage automaticamente ---------
    useEffect(() => {
        try {
            const payload: PersistedState = {
                currentIndex,
                showInstructions,
                answers,
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        } catch {
            // sem espaço / bloqueado etc.
        }
    }, [currentIndex, showInstructions, answers]);

    const clearPersisted = () => {
        try {
            localStorage.removeItem(STORAGE_KEY);
        } catch { }
    };

    const handleRestartTest = () => {
        // Limpa tudo e volta ao início
        clearPersisted();
        setCurrentIndex(0);
        setAnswers({});
        setShowInstructions(true);
        setShowResults(false);
        setFieldErrors({});
    };

    // --------- Validação Zod apenas para dados pessoais ---------
    const validatePersonal = () => {
        const personal = {
            nome: answers.nome ?? "",
            Whatsapp: answers.Whatsapp ?? "",
            email: answers.email ?? "",
        };

        const result = PersonalDataSchema.safeParse(personal);
        return result;
    };

    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});


    const setZodErrorsToState = (zodError: ZodError) => {
        const formatted: Record<string, string> = {};

        for (const issue of zodError.issues) {
            const key = String(issue.path?.[0] ?? "");
            if (key) formatted[key] = issue.message;
        }

        setFieldErrors(formatted);
    };


    const goTo = (dir: "next" | "prev") => {
        if (isTransitioning) return;

        if (dir === "next" && !canGoNext) return;
        if (dir === "prev" && !canGoPrev) return;

        setTransitionDir(dir);
        setIsTransitioning(true);

        if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        timeoutRef.current = window.setTimeout(() => {
            setCurrentIndex((i) => (dir === "next" ? i + 1 : i - 1));
            setIsTransitioning(false);
        }, TRANSITION_MS);
    };

    const handlePrevious = () => goTo("prev");

    const handleStart = () => {
        setShowInstructions(false);

        // se ainda não existe, seta padrão
        setAnswers((prev) => ({
            ...prev,
            Whatsapp: prev.Whatsapp?.trim() ? prev.Whatsapp : "+55 ",
        }));
    };


    const handleAnswerChange = (value: string) => {
        // limpa erro do campo atual ao digitar
        setFieldErrors((prev) => {
            const next = { ...prev };
            delete next[currentQuestion.id];
            return next;
        });

        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));
    };

    /**
     * Regra:
     * - Durante dados pessoais, valida com Zod ANTES de avançar para a próxima pergunta (inclusive no Enter).
     * - Nas perguntas de arquétipo, continua como você já estava (vai pelo answered / auto-advance etc.).
     */
    const PersonalFieldSchemas = {
        nome: PersonalDataSchema.pick({ nome: true }),
        Whatsapp: PersonalDataSchema.pick({ Whatsapp: true }),
        email: PersonalDataSchema.pick({ email: true }),
    } as const;

    const handleNext = () => {
        if (!answers[currentQuestion.id]) return;

        if (isInitialPhase) {
            const fieldId = currentQuestion.id as keyof typeof PersonalFieldSchemas;

            const fieldSchema = PersonalFieldSchemas[fieldId];
            if (fieldSchema) {
                const result = fieldSchema.safeParse({
                    [fieldId]: answers[fieldId] ?? "",
                });

                if (!result.success) {
                    setZodErrorsToState(result.error);
                    return;
                }
            }
        }

        // Se chegou ao final, mostra resultados
        if (isLastQuestion) {
            setShowResults(true);
        } else {
            goTo("next");
        }
    };


    const selectAndMaybeAdvance = (value: string, autoAdvance: boolean) => {
        if (isTransitioning) return;

        setAnswers((prev) => ({ ...prev, [currentQuestion.id]: value }));

        if (autoAdvance && canGoNext) {
            window.setTimeout(() => goTo("next"), 0);
        }
    };

    // --------- Auto-focus no input desde o primeiro ---------
    useEffect(() => {
        if (showInstructions) return;

        const isInput =
            currentQuestion.type === "text" ||
            currentQuestion.type === "email" ||
            currentQuestion.type === "tel" ||
            currentQuestion.type === "date";

        if (!isInput) return;

        const t = window.setTimeout(() => {
            inputRef.current?.focus();
        }, 0);

        return () => window.clearTimeout(t);
    }, [showInstructions, currentQuestion.id, currentQuestion.type]);

    // --------- Teclas globais (Backspace / Enter fora de input / 1-5 Likert) ---------
    useEffect(() => {
        if (showInstructions) return;

        const onKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement | null;
            const tag = target?.tagName?.toLowerCase();
            const isTypingField =
                tag === "input" || tag === "textarea" || (target as any)?.isContentEditable;

            if (!isTypingField && e.key === "Backspace") {
                e.preventDefault();
                handlePrevious();
                return;
            }

            if (!isTypingField && e.key === "Enter") {
                e.preventDefault();
                handleNext();
                return;
            }

            const isArchetypeLikert =
                !isInitialPhase &&
                currentQuestion.type === "radio" &&
                currentQuestion.options === LIKERT_1_5_OPTIONS;

            if (isArchetypeLikert && e.key >= "1" && e.key <= "5") {
                e.preventDefault();
                const idx = Number(e.key) - 1;
                const selected = LIKERT_1_5_OPTIONS[idx];
                selectAndMaybeAdvance(selected, true);
            }
        };

        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showInstructions, currentQuestion, isInitialPhase, answers]);

    useEffect(() => {
        return () => {
            if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
        };
    }, []);

    useEffect(() => {
        if (showInstructions) return;
        const isPhone = currentQuestion.id === "Whatsapp" && currentQuestion.type === "tel";
        if (!isPhone) return;

        const el = inputRef.current;
        if (!el) return;

        // move cursor para o final (evita ficar preso antes do +55)
        const t = window.setTimeout(() => {
            const len = el.value.length;
            el.setSelectionRange(len, len);
        }, 0);

        return () => window.clearTimeout(t);
    }, [showInstructions, currentQuestion.id, currentQuestion.type]);


    // Tipagem correta do React para inputs
    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleNext();
        }
    };

    if (showResults) {
        const scores = calculateArchetypeScores(answers);
        return (
            <ResultScreen
                scores={scores}
                personalData={{
                    nome: answers.nome || "",
                    email: answers.email || "",
                    Whatsapp: answers.Whatsapp || "",
                }}
                onRestart={handleRestartTest}
            />
        );
    }

    if (showInstructions) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen gap-8 px-4">
                <h1 className="text-4xl font-bold text-center">
                    Propriedade intelectual e autora do teste: Carol S. Pearson
                </h1>
                <h2 className="text-2xl font-semibold">Instruções</h2>
                <div className="w-full md:w-1/2 lg:w-1/3 text-lg space-y-4">
                    <p>
                        Indique a frequência com que cada afirmação descreve melhor o seu comportamento, assinale na frente
                        de cada questão, o que melhor descreve você nesse momento.
                    </p>
                    <div className="space-y-2">
                        <p>
                            <strong>A</strong> = Quase nunca aplica-se a mim
                        </p>
                        <p>
                            <strong>B</strong> = Raramente aplica-se a mim
                        </p>
                        <p>
                            <strong>C</strong> = Às vezes aplica-se a mim
                        </p>
                        <p>
                            <strong>D</strong> = Geralmente aplica-se a mim
                        </p>
                        <p>
                            <strong>E</strong> = Quase sempre aplica-se a mim
                        </p>
                    </div>

                    <p className="text-sm text-gray-600">
                        Dica: nas perguntas do arquétipo, você pode usar as teclas <strong>1</strong> a <strong>5</strong> para
                        selecionar e avançar automaticamente.
                    </p>
                </div>

                <Button onClick={handleStart} className="cursor-pointer px-8 py-2 text-lg">
                    Começar o teste
                </Button>

                {/* Opcional: se quiser limpar progresso anterior */}
                <button
                    type="button"
                    onClick={() => {
                        clearPersisted();
                        setAnswers({});
                        setCurrentIndex(0);
                        setShowInstructions(true);
                        setFieldErrors({});
                    }}
                    className="text-sm text-gray-500 underline"
                >
                    Limpar progresso salvo
                </button>
            </div>
        );
    }

    const answered = !!answers[currentQuestion.id];

    return (
        <div className="flex flex-col justify-center items-center min-h-screen gap-8 px-4">
            <div className="w-full md:w-1/2 lg:w-1/3">
                <h1 className="text-2xl font-semibold mb-2">
                    {isInitialPhase ? "Dados Pessoais" : "Perguntas do Arquétipo"}
                </h1>

                <p className="text-gray-600 mb-4">
                    Pergunta {currentIndex + 1} de {allQuestions.length}
                </p>

                <div className="w-full bg-gray-200 h-2 rounded-full mb-6">
                    <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
                    />
                </div>

                <div
                    key={currentQuestion.id}
                    className={[
                        "space-y-6 transition-all duration-200 will-change-transform",
                        isTransitioning
                            ? transitionDir === "next"
                                ? "opacity-0 translate-y-2"
                                : "opacity-0 -translate-y-2"
                            : "opacity-100 translate-y-0",
                    ].join(" ")}
                >
                    <h2 className="text-xl font-semibold">{currentQuestion.label}</h2>

                    {currentQuestion.type === "text" && (
                        <div className="space-y-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={answers[currentQuestion.id] || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="Digite sua resposta"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {fieldErrors[currentQuestion.id] && (
                                <p className="text-sm text-red-600">{fieldErrors[currentQuestion.id]}</p>
                            )}
                        </div>
                    )}

                    {currentQuestion.type === "email" && (
                        <div className="space-y-2">
                            <input
                                ref={inputRef}
                                type="email"
                                value={answers[currentQuestion.id] || ""}
                                onChange={(e) => handleAnswerChange(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder="seu@email.com"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {fieldErrors[currentQuestion.id] && (
                                <p className="text-sm text-red-600">{fieldErrors[currentQuestion.id]}</p>
                            )}
                        </div>
                    )}

                    {currentQuestion.type === "tel" && (
                        <div className="space-y-2">
                            <input
                                ref={inputRef}
                                type="tel"
                                inputMode="tel"
                                autoComplete="tel"
                                value={answers[currentQuestion.id] || "+55 "}
                                onChange={(e) => {
                                    const masked = maskPhoneInput(e.target.value);
                                    handleAnswerChange(masked);
                                }}
                                onKeyDown={handleInputKeyDown}
                                placeholder="+55 (11) 99999-9999"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                            />
                            {fieldErrors[currentQuestion.id] && (
                                <p className="text-sm text-red-600">{fieldErrors[currentQuestion.id]}</p>
                            )}
                        </div>
                    )}


                    {currentQuestion.type === "date" && (
                        <input
                            ref={inputRef}
                            type="date"
                            value={answers[currentQuestion.id] || ""}
                            onChange={(e) => handleAnswerChange(e.target.value)}
                            onKeyDown={handleInputKeyDown}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                        />
                    )}

                    {currentQuestion.type === "radio" && currentQuestion.options && (
                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <label
                                    key={option}
                                    className="flex items-center space-x-3 cursor-pointer p-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    <input
                                        type="radio"
                                        name={currentQuestion.id}
                                        value={option}
                                        checked={answers[currentQuestion.id] === option}
                                        onChange={(e) => {
                                            const value = e.target.value;
                                            const isLikert = currentQuestion.options === LIKERT_1_5_OPTIONS;

                                            // aqui continua como você já vinha fazendo
                                            const autoAdvance = isLikert || true;

                                            selectAndMaybeAdvance(value, autoAdvance);
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <span>{option}</span>
                                </label>
                            ))}
                        </div>
                    )}
                </div>

                <div className="flex gap-4 mt-8">
                    <Button onClick={handlePrevious} disabled={!canGoPrev || isTransitioning} className="cursor-pointer">
                        Anterior
                    </Button>

                    <Button
                        onClick={handleNext}
                        disabled={!answered || isTransitioning}
                        className="cursor-pointer"
                    >
                        {isLastQuestion ? "Finalizar" : "Próximo"}
                    </Button>
                </div>
            </div>
        </div>
    );
}
