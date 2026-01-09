import { prisma } from "../../prisma";
import { verify, sign } from "jsonwebtoken";

interface RefreshTokenRequest {
  refreshToken: string;
}

interface TokenPayload {
  id: string;
  sub: string;
}

class RefreshTokenService {
  async execute({ refreshToken }: RefreshTokenRequest) {
    console.log("[SERVICE] RefreshTokenService - Iniciando refresh...");

    // ===========================================
    // 1. VERIFICAR SE O REFRESH TOKEN É VÁLIDO (JWT)
    // ===========================================
    // O verify() decodifica o token e verifica:
    // - Se a assinatura bate com JWT_REFRESH_SECRET
    // - Se o token não expirou (2 dias)
    let decoded: TokenPayload;

    try {
      decoded = verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as TokenPayload;
      console.log("[SERVICE] Token JWT válido");
    } catch {
      console.log("[SERVICE] Erro: Token JWT inválido ou expirado");
      throw new Error("Refresh token inválido ou expirado");
    }

    // ===========================================
    // 2. VERIFICAR SE O TOKEN EXISTE NO BANCO
    // ===========================================
    // SEGURANÇA: Mesmo se o JWT for válido, verificamos
    // se ele ainda existe no banco. Se não existe:
    // - Token já foi usado (rotação)
    // - Token foi revogado (logout)
    // - Hacker tentando usar token roubado que já foi rotacionado
    const tokenExists = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!tokenExists) {
      console.log("[SERVICE] Erro: Token não existe no banco (já usado ou revogado)");
      throw new Error("Token já foi utilizado ou revogado");
    }

    console.log("[SERVICE] Token existe no banco, verificando usuário...");

    // ===========================================
    // 3. BUSCAR USUÁRIO NO BANCO
    // ===========================================
    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
    });

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    // ===========================================
    // 4. DELETAR O TOKEN ANTIGO DO BANCO
    // ===========================================
    // ROTAÇÃO: O token usado é invalidado imediatamente
    // Se hacker tentar usar depois → não existe → BLOQUEADO
    await prisma.refreshToken.delete({
      where: { id: tokenExists.id },
    });

    // ===========================================
    // 5. GERAR NOVO ACCESS TOKEN (15 minutos)
    // ===========================================
    const newAccessToken = sign(
      {
        name: user.name,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      {
        subject: user.id,
        expiresIn: "15m",
      }
    );

    // ===========================================
    // 6. GERAR NOVO REFRESH TOKEN (2 dias)
    // ===========================================
    const newRefreshToken = sign(
      {
        id: user.id,
      },
      process.env.JWT_REFRESH_SECRET as string,
      {
        subject: user.id,
        expiresIn: "2d",
      }
    );

    // ===========================================
    // 7. SALVAR NOVO REFRESH TOKEN NO BANCO
    // ===========================================
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);

    await prisma.refreshToken.create({
      data: {
        token: newRefreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // ===========================================
    // 8. RETORNAR AMBOS OS TOKENS
    // ===========================================
    console.log("[SERVICE] Tokens renovados com sucesso!");

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }
}

export { RefreshTokenService };
