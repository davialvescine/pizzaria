import cors from "cors";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";

const app = express();

app.use(express.json());
app.use(cors());
app.use(router);

// Middleware para rotas não encontradas (404)
app.use((req: Request, res: Response) => {
  console.log(`[404] Rota não encontrada: ${req.method} ${req.path}`);
  return res.status(404).json({
    error: "Rota não encontrada",
    method: req.method,
    path: req.path,
    dica: "Verifique se a rota existe e se o método HTTP está correto",
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  // Log do erro no console
  console.log("=== ERRO CAPTURADO ===");
  console.log("Mensagem:", error.message);
  console.log("Stack:", error.stack);
  console.log("======================");

  // Se for um erro conhecido (lançado pelo nosso código)
  if (error.message) {
    return res.status(400).json({
      error: error.message,
    });
  }

  // Erro desconhecido
  return res.status(500).json({
    error: "Erro interno do servidor",
  });
});

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

export { app };
