import { NextFunction, Request, Response } from "express";
import { ZodError, ZodType } from "zod";

/**
 * Middleware de validação usando Zod
 * Valida os dados da requisição (body, params, query) contra um schema
 * @param schema - Schema Zod para validação
 * @returns Middleware Express
 */
export const validateSchema =
  (schema: ZodType) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Valida body, params e query da requisição
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      // Se passou na validação, continua para o próximo middleware
      return next();
    } catch (error) {
      // Se o erro for de validação do Zod
      if (error instanceof ZodError) {
        return res.status(400).json({
          Error: "Erro de Validação",
          details: error.issues.map((issue) => ({
            campo: issue.path, // Caminho do campo com erro
            Mensagem: issue.message, // Mensagem de erro
          })),
        });
      }

      // Erro desconhecido
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };
