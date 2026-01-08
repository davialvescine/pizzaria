import { Request, Response, NextFunction } from "express";
import { prisma } from "../prisma";

/**
 * Middleware que verifica se o usuário é ADMIN
 * IMPORTANTE: Deve ser usado APÓS o isAuthenticated
 */
export async function isAdmin(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Pega o userId que foi colocado pelo isAuthenticated
  const userId = req.userId;

  // 2. Busca o usuário no banco para ver o role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  // 3. Se não encontrou o usuário
  if (!user) {
    console.log("[ADMIN] Erro: Usuário não encontrado no banco");
    return res.status(401).json({ error: "Usuário não encontrado" });
  }

  // 4. Verifica se é ADMIN
  if (user.role !== "ADMIN") {
    console.log("[ADMIN] Acesso negado - Usuário não é ADMIN:", req.userEmail);
    return res.status(403).json({ error: "Acesso negado. Apenas administradores." });
  }

  console.log("[ADMIN] Acesso permitido - ADMIN:", req.userEmail);

  // 5. É admin, continua para o próximo middleware/controller
  return next();
}
