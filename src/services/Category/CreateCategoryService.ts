import { prisma } from "../../prisma";

interface CreateCategoryProps {
  name: string;
}

class CreateCategoryService {
  // Criar uma categoria
  async execute({ name }: CreateCategoryProps) {
    // Verificar se a categoria já existe
    const categoryExists = await prisma.category.findUnique({
      where: { name },
    });

    if (categoryExists) {
      throw new Error("Categoria já cadastrada");
    }

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

    return category;
  }
}

export { CreateCategoryService };
