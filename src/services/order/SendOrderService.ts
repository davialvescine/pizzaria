import { prisma } from "../../prisma";

interface SendOrderProps {
  order_id: string;
}

class SendOrderService {
  async execute({ order_id }: SendOrderProps) {
    console.log("[SERVICE] SendOrderService - Enviando pedido para producao...");
    console.log("[SERVICE] Order ID:", order_id);

    // 1. Verificar se o pedido existe
    const order = await prisma.order.findUnique({
      where: { id: order_id },
      include: {
        _count: {
          select: { Items: true },
        },
      },
    });

    if (!order) {
      console.log("[SERVICE] Erro: Pedido nao encontrado");
      throw new Error("Pedido nao encontrado");
    }

    // 2. Verificar se o pedido esta em draft
    if (!order.draft) {
      console.log("[SERVICE] Erro: Pedido ja foi enviado");
      throw new Error("Pedido ja foi enviado");
    }

    // 3. Verificar se tem pelo menos 1 item
    if (order._count.Items === 0) {
      console.log("[SERVICE] Erro: Pedido nao tem itens");
      throw new Error("Pedido nao tem itens");
    }

    // 4. Atualizar draft para false
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { draft: false },
    });

    console.log("[SERVICE] Pedido enviado para producao!");

    return updatedOrder;
  }
}

export { SendOrderService };
