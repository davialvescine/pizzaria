import { prisma } from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthUserRequest {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserRequest) {
    // ===========================================
    // 1. VERIFICAR SE O USUÁRIO EXISTE
    // ===========================================
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Email ou senha incorretos");
    }

    // ===========================================
    // 2. VERIFICAR SE A SENHA ESTÁ CORRETA
    // ===========================================
    // compare() compara a senha digitada com o hash salvo no banco
    const passwordMatch = await compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Email ou senha incorretos");
    }

    // ===========================================
    // 3. GERAR ACCESS TOKEN (15 minutos)
    // ===========================================
    // Token curto usado para acessar rotas protegidas
    const accessToken = sign(
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
    // 4. GERAR REFRESH TOKEN (2 dias)
    // ===========================================
    const refreshToken = sign(
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
    // 5. SALVAR REFRESH TOKEN NO BANCO
    // ===========================================
    // Calculamos a data de expiração (2 dias a partir de agora)
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 2);

    // Salvamos o token no banco vinculado ao usuário
    // Isso permite:
    // - Verificar se o token ainda é válido (existe no banco)
    // - Invalidar tokens antigos (deletar do banco)
    // - Fazer logout (deletar token)
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: user.id,
        expiresAt,
      },
    });

    // ===========================================
    // 6. RETORNAR DADOS DO USUÁRIO E TOKENS
    // ===========================================
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
}

export { AuthUserService };
