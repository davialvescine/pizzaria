import { prisma } from "../../prisma";
import { hash } from "bcryptjs";

interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserRequest) {
    // Verificar se email já existe
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      throw new Error("Email já cadastrado");
    }

    // Hash da senha
    const passwordHash = await hash(password, 10);

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

    return user;
  }
}

export { CreateUserService };
