import { prisma } from "../../prisma";
import { hash } from "bcryptjs";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserRequest) {
    console.log("[SERVICE] CreateUserService - Iniciando...");
    console.log("[SERVICE] Email:", email);

    // Verificar se email já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      console.log("[SERVICE] Erro: Email já existe no banco");
      throw new Error("Email já cadastrado");
    }

    console.log("[SERVICE] Email disponível, criando hash da senha...");

    // Hash da senha
    const passwordHash = await hash(password, 10);

    console.log("[SERVICE] Hash criado, salvando no banco...");

    // Criar usuário no banco
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    console.log("[SERVICE] Usuário criado com sucesso! ID:", user.id);

    return user;
  }
}

export { CreateUserService };
