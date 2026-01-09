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
    console.log("[VALIDAÇÃO] Iniciando validação dos dados...");
    console.log("[VALIDAÇÃO] Dados recebidos:", JSON.stringify(req.body));

    try {
      // Valida body, params e query da requisição
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      console.log("[VALIDAÇÃO] Dados válidos! Continuando...");

      // Se passou na validação, continua para o próximo middleware
      return next();
    } catch (error) {
      // Se o erro for de validação do Zod
      if (error instanceof ZodError) {
        console.log("[VALIDAÇÃO] Erro de validação:", error.issues);
        return res.status(400).json({
          Error: "Erro de Validação",
          details: error.issues.map((issue) => ({
            campo: issue.path, // Caminho do campo com erro
            Mensagem: issue.message, // Mensagem de erro
          })),
        });
      }

      console.log("[VALIDAÇÃO] Erro desconhecido:", error);

      // Erro desconhecido
      return res.status(500).json({
        error: "Internal Server Error",
      });
    }
  };
