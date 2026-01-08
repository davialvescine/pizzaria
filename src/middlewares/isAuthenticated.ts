import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

interface TokenPayload {
  name: string;
  email: string;
  sub: string;
}

export function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // 1. Pegar o token do header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não enviado" });
  }

  // 2. Formato: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const [, token] = authHeader.split(" ");

  // 3. Verificar se o token é válido
  try {
    const decoded = verify(token, process.env.JWT_SECRET as string) as TokenPayload;

    // 4. Colocar os dados do usuário no request
    req.userId = decoded.sub;
    req.userName = decoded.name;
    req.userEmail = decoded.email;

    // 5. Continuar para o próximo middleware/controller
    return next();
  } catch {
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
