import { prisma } from "../../prisma";

class ListCategoriesService {
  async execute() {
    console.log("[SERVICE] ListCategoriesService - Buscando categorias...");

    // ===========================================
    // BUSCAR TODAS AS CATEGORIAS
    // ===========================================
    // Retorna todas as categorias ordenadas por nome
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    console.log(`[SERVICE] ${categories.length} categoria(s) encontrada(s)`);

    return categories;
  }
}

export { ListCategoriesService };
