import { prisma } from "../../prisma";

interface ListAllProductsProps {
  disabled?: boolean;
}

class ListAllProductsService {
  async execute({ disabled = false }: ListAllProductsProps) {
    console.log("[SERVICE] ListAllProductsService - Listando produtos...");
    console.log("[SERVICE] Filtro disabled:", disabled);

    const products = await prisma.product.findMany({
      where: {
        disabled,
      },
      orderBy: {
        name: "asc",
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    console.log("[SERVICE]", products.length, "produto(s) encontrado(s)");

    return products;
  }
}

export { ListAllProductsService };
