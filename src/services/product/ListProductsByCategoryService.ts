import { prisma } from "../../prisma";

class ListProductsByCategoryService {
  async execute(categoryId: string) {
    console.log("[SERVICE] ListProductsByCategoryService - Iniciando...");
    console.log("[SERVICE] Category ID:", categoryId);

    // ===========================================
    // BUSCAR PRODUTOS DA CATEGORIA
    // ===========================================
    // Retorna apenas produtos nao desabilitados
    // Ordenados por nome em ordem alfabetica
    const products = await prisma.product.findMany({
      where: {
        categoryId,
        disabled: false,
      },
      orderBy: {
        name: "asc",
      },
    });

    console.log(`[SERVICE] ${products.length} produto(s) encontrado(s)`);

    return products;
  }
}

export { ListProductsByCategoryService };
