// validation.ts
import { z } from "zod";

const onlyDigits = (s: string) => s.replace(/\D/g, "");

const E164PhoneSchema = z
  .string()
  .trim()
  .min(1, "Informe seu WhatsApp.")
  .refine((val) => val.startsWith("+"), "Use o formato internacional iniciando com + (ex: +55).")
  .refine((val) => {
    // + seguido de 1-3 dígitos de DDI (sem validar tabela de países, só forma)
    const m = val.match(/^\+(\d{1,3})/);
    return !!m;
  }, "DDI inválido. Ex: +55, +1, +351.")
  .refine((val) => {
    // E.164: 8..15 dígitos no total (sem contar o +)
    const digits = onlyDigits(val);
    return digits.length >= 8 && digits.length <= 15;
  }, "Telefone inválido (quantidade de dígitos incompatível).")
  .superRefine((val, ctx) => {
    // Regra extra para BR quando DDI=55:
    // Após o 55, esperamos DDD (2) + número (8 ou 9) => nacional 10 ou 11.
    // Total dígitos: 55 + 10/11 => 12 ou 13.
    const digits = onlyDigits(val); // inclui DDI sem o +
    if (digits.startsWith("55")) {
      const rest = digits.slice(2); // DDD + numero
      const ok = rest.length === 10 || rest.length === 11;
      if (!ok) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "WhatsApp BR deve ter DDD + número (10 ou 11 dígitos após o 55).",
        });
      }
    }
  });

export const PersonalDataSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Informe seu nome (mín. 2 caracteres).")
    .max(80, "Nome muito longo."),
  Whatsapp: E164PhoneSchema,
  email: z.string().trim().email("Email inválido."),
});

export type PersonalData = z.infer<typeof PersonalDataSchema>;
