const onlyDigits = (s: string) => s.replace(/\D/g, "");

/**
 * Detecta DDI a partir de uma string com +digits...
 * Retorna { ddi, restDigits } (resto sem o DDI).
 */
function parseDDI(input: string): { ddi: string; rest: string } {
  const normalized = input.trim();
  const m = normalized.match(/^\+(\d{1,3})(.*)$/);
  if (!m) return { ddi: "", rest: "" };

  const ddi = m[1]; // 1..3
  const rest = onlyDigits(m[2] ?? "");
  return { ddi, rest };
}

/**
 * Formata BR quando +55:
 * +55 (DD) 9XXXX-XXXX ou +55 (DD) XXXX-XXXX
 */
function formatBR(rest: string): string {
  // rest = DDD + numero (sem 55)
  const ddd = rest.slice(0, 2);
  const num = rest.slice(2);

  if (!ddd) return "+55 ";

  // 8 ou 9 dígitos no número local
  const part1 = num.slice(0, num.length === 9 ? 5 : 4);
  const part2 = num.slice(num.length === 9 ? 5 : 4, (num.length === 9 ? 9 : 8));

  if (!num) return `+55 (${ddd}`;
  if (num.length <= (num.length === 9 ? 5 : 4)) return `+55 (${ddd}) ${part1}`;

  return `+55 (${ddd}) ${part1}-${part2}`;
}

/**
 * Formata genérico para outros DDI:
 * Mantém +DDI e agrupa o restante em blocos (3-3-...).
 * Não tenta ser perfeito, apenas legível e consistente.
 */
function formatInternational(ddi: string, rest: string): string {
  if (!ddi) return "+";
  if (!rest) return `+${ddi} `;

  // quebra em blocos de 3/3/4 para legibilidade
  const blocks: string[] = [];
  let i = 0;
  while (i < rest.length) {
    const remaining = rest.length - i;
    const size = remaining > 7 ? 3 : remaining > 4 ? 3 : remaining; // heurística simples
    blocks.push(rest.slice(i, i + size));
    i += size;
  }

  return `+${ddi} ${blocks.join(" ")}`.trim();
}

/**
 * Máscara principal:
 * - Se começa com +55 => aplica BR
 * - Caso contrário => formatação internacional simples
 * - Se usuário apagar tudo => volta para "+55 " como default
 */
export function maskPhoneInput(value: string): string {
  const trimmed = value.trim();

  // garante que sempre existe um + no começo (se usuário estiver mexendo nisso)
  if (!trimmed) return "+55 ";

  if (!trimmed.startsWith("+")) {
    // se ele digitou só números, assume que quer continuar após +55
    const digits = onlyDigits(trimmed);
    return formatBR(digits); // assume BR
  }

  const { ddi, rest } = parseDDI(trimmed);

  // se não conseguiu parsear DDI, mantém só "+" + dígitos iniciais
  if (!ddi) {
    const digits = onlyDigits(trimmed);
    return digits ? `+${digits.slice(0, 3)} ` : "+";
  }

  if (ddi === "55") {
    // rest = DDD + numero; limita para 11 dígitos no máximo (DDD + 9)
    const limited = rest.slice(0, 11);
    return formatBR(limited);
  }

  // outros DDI: limita total E.164 (15 dígitos incluindo DDI)
  const totalDigits = (ddi + rest).slice(0, 15);
  const newRest = totalDigits.slice(ddi.length);
  return formatInternational(ddi, newRest);
}
