import { prisma } from "../../prisma";

interface DetailOrderProps {
  order_id: string;
}

class DetailOrderService {
  async execute({ order_id }: DetailOrderProps) {
    console.log("[SERVICE] DetailOrderService - Buscando detalhes do pedido...");
    console.log("[SERVICE] Order ID:", order_id);

    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: {
        Items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                description: true,
                price: true,
                banner: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      console.log("[SERVICE] Erro: Pedido nao encontrado");
      throw new Error("Pedido nao encontrado");
    }

    console.log("[SERVICE] Pedido encontrado! Itens:", order.Items.length);

    return order;
  }
}

export { DetailOrderService };
