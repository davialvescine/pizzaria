import { prisma } from "../../prisma";

interface ProductRequest {
  name: string;
  description: string;
  price: number;
  banner: string;
  categoryId: string;
}

class CreateProductService {
  async execute({ name, description, price, banner, categoryId }: ProductRequest) {
    console.log("[SERVICE] CreateProductService - Iniciando...");
    console.log("[SERVICE] Dados recebidos:", { name, description, price, categoryId });

    // ===========================================
    // 1. VERIFICAR SE A CATEGORIA EXISTE
    // ===========================================
    const categoryExists = await prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      console.log("[SERVICE] Erro: Categoria nao encontrada");
      throw new Error("Categoria nao encontrada");
    }

    console.log("[SERVICE] Categoria encontrada:", categoryExists.name);

    // ===========================================
    // 2. CRIAR O PRODUTO NO BANCO
    // ===========================================
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        banner,
        categoryId,
      },
    });

    console.log("[SERVICE] Produto criado com sucesso! ID:", product.id);

    return product;
  }
}

export { CreateProductService };
