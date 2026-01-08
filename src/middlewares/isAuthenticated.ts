import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
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
    console.log("[AUTH] Erro: Token não enviado");
    return res.status(401).json({ error: "Token não enviado" });
  }

  // 2. Formato: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  const [bearer, token] = authHeader.split(" ");

  // Verificar se o formato é "Bearer <token>"
  if (bearer !== "Bearer") {
    console.log("[AUTH] Erro: Formato Bearer inválido - Recebido:", bearer);
    return res
      .status(401)
      .json({ error: "Formato de autorização inválido. Use: Bearer <token>" });
  }

  if (!token) {
    console.log("[AUTH] Erro: Token não fornecido após Bearer");
    return res.status(401).json({ error: "Token não fornecido" });
  }

  // 3. Verificar se o token é válido
  try {
    const decoded = verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // 4. Colocar os dados do usuário no request
    req.userId = decoded.sub;
    req.userName = decoded.name;
    req.userEmail = decoded.email;

    console.log("[AUTH] Token válido - Usuário:", decoded.email);

    // 5. Continuar para o próximo middleware/controller
    return next();
  } catch {
    console.log("[AUTH] Erro: Token inválido ou expirado");
    console.log("[AUTH] Token com erro:", token);
    return res.status(401).json({ error: "Token inválido ou expirado" });
  }
}
