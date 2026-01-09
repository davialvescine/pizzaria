import { prisma } from "../../prisma";

interface CreateCategoryProps {
  name: string;
}

class CreateCategoryService {
  // Criar uma categoria
  async execute({ name }: CreateCategoryProps) {
    console.log("[SERVICE] CreateCategoryService - Iniciando...");
    console.log("[SERVICE] Nome da categoria:", name);

    // Verificar se a categoria já existe
    const categoryExists = await prisma.category.findUnique({
      where: { name },
    });

    if (categoryExists) {
      console.log("[SERVICE] Erro: Categoria já existe no banco");
      throw new Error("Categoria já cadastrada");
    }

    console.log("[SERVICE] Categoria não existe, criando...");

    // Criar a categoria no banco
    const category = await prisma.category.create({
      data: {
        name,
      },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    console.log("[SERVICE] Categoria criada com sucesso! ID:", category.id);

    return category;
  }
}

export { CreateCategoryService };
