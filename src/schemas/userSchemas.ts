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
    email: z.email({ error: "Email inválido" }),
    password: passwordSchema.describe("Senha é obrigatória"),
  }),
});

export const updateUserSchema = z.object({
  body: z.object({
    username: z.string().min(3).max(30).optional(),
    email: z.email().optional(),
    password: passwordSchema.optional(),
  }),
});

export const getUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export const deleteUserSchema = z.object({
  params: z.object({
    userId: z.uuid(),
  }),
});

export const authenticateUserSchema = z.object({
  body: z.object({
    email: z.email({ error: "Email inválido" }),
    password: z.string({ error: "Senha é obrigatória" }),
  }),
});

export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({ error: "Refresh token é obrigatório" }),
  }),
});
