import { prisma } from "../../prisma";

class DetailUserService {
  async execute(userId: string) {
    console.log("[SERVICE] DetailUserService - Buscando usuário...");
    console.log("[SERVICE] UserId:", userId);

    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      console.log("[SERVICE] Erro: Usuário não encontrado");
      throw new Error("Usuário não encontrado");
    }

    console.log("[SERVICE] Usuário encontrado:", user.email);

    return user;
  }
}

export { DetailUserService };
