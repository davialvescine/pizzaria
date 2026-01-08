import { prisma } from "../../prisma";

interface LogoutRequest {
  userId: string;
}

class LogoutService {
  async execute({ userId }: LogoutRequest) {
    // ===========================================
    // DELETAR TODOS OS REFRESH TOKENS DO USUÁRIO
    // ===========================================
    // Ao fazer logout, invalidamos TODOS os tokens do usuário
    // Isso significa que:
    // - Mesmo que hacker tenha roubado um token, não funciona mais
    // - Usuário é deslogado de todos os dispositivos
    // - Para continuar usando, precisa fazer login novamente
    await prisma.refreshToken.deleteMany({
      where: { userId },
    });

    return { message: "Logout realizado com sucesso" };
  }
}

export { LogoutService };
