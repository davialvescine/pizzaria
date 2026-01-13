import { prisma } from "../../prisma";

interface FinishOrderProps {
  order_id: string;
}

class FinishOrderService {
  async execute({ order_id }: FinishOrderProps) {
    console.log("[SERVICE] FinishOrderService - Finalizando pedido...");
    console.log("[SERVICE] Order ID:", order_id);

    // 1. Verificar se o pedido existe
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      console.log("[SERVICE] Erro: Pedido nao encontrado");
      throw new Error("Pedido nao encontrado");
    }

    // 2. Verificar se o pedido nao esta em draft
    if (order.draft) {
      console.log("[SERVICE] Erro: Pedido ainda esta em rascunho, envie primeiro");
      throw new Error("Pedido ainda esta em rascunho, envie primeiro");
    }

    // 3. Verificar se ja nao foi finalizado
    if (order.status) {
      console.log("[SERVICE] Erro: Pedido ja foi finalizado");
      throw new Error("Pedido ja foi finalizado");
    }

    // 4. Atualizar status para true (finalizado)
    const updatedOrder = await prisma.order.update({
      where: { id: order_id },
      data: { status: true },
    });

    console.log("[SERVICE] Pedido finalizado com sucesso!");

    return updatedOrder;
  }
}

export { FinishOrderService };
