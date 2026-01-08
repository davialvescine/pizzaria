import { z } from "zod";

const passwordSchema = z
  .string({ error: "Senha não enviada" })
  .min(8, { error: "A senha deve ter no mínimo 8 caracteres" })
  .refine((password) => /[A-Z]/.test(password), {
    error: "A senha deve conter pelo menos uma letra maiúscula",
  })
  .refine((password) => /[0-9]/.test(password), {
    error: "A senha deve conter pelo menos um número",
  })
  .refine((password) => /[!@#$%^&*(),.?":{}|<>]/.test(password), {
    error:
      'A senha deve conter pelo menos um caractere especial (!@#$%^&*(),.?":{}|<>)',
  });

export const createUserSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Nome não enviado" })
      .min(3, { error: "O Nome precisa ter no mínimo 3 caracteres" })
      .max(30),
    email: z.string({ error: "Email não enviado" }).email({ error: "Email inválido" }),
    password: passwordSchema,
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.string().email().optional(),
    password: passwordSchema.optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.string().uuid(),
  }),
});
