import { z } from "zod";

/**
 * Schema de validação para criar categoria
 * Valida se o nome foi enviado e tem pelo menos 2 caracteres
 */
export const createCategorySchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Nome da categoria é obrigatório" })
      .min(2, { error: "Nome deve ter pelo menos 2 caracteres" }),
  }),
});
