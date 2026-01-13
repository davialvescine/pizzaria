import { prisma } from "../../prisma";

interface ListOrdersProps {
  draft?: boolean;
}

class ListOrdersService {
  async execute({ draft }: ListOrdersProps) {
    console.log("[SERVICE] ListOrdersService - Listando pedidos...");
    console.log("[SERVICE] Filtro draft:", draft);

    const where = draft !== undefined ? { draft } : {};

    const orders = await prisma.order.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        _count: {
          select: { Items: true },
        },
      },
    });

    console.log("[SERVICE]", orders.length, "pedido(s) encontrado(s)");

    return orders;
  }
}

export { ListOrdersService };
