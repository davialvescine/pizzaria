import { prisma } from "../../prisma";

interface DeleteOrderProps {
  order_id: string;
}

class DeleteOrderService {
  async execute({ order_id }: DeleteOrderProps) {
    console.log("[SERVICE] DeleteOrderService - Deletando pedido...");
    console.log("[SERVICE] Order ID:", order_id);

    // 1. Verificar se o pedido existe
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      console.log("[SERVICE] Erro: Pedido nao encontrado");
      throw new Error("Pedido nao encontrado");
    }

    // 2. So permite deletar se estiver em draft
    if (!order.draft) {
      console.log("[SERVICE] Erro: So pode deletar pedidos em rascunho");
      throw new Error("So pode deletar pedidos em rascunho");
    }

    // 3. Deletar pedido (itens sao deletados por cascade)
    await prisma.order.delete({
      where: { id: order_id },
    });

    console.log("[SERVICE] Pedido deletado com sucesso!");

    return { message: "Pedido deletado com sucesso" };
  }
}

export { DeleteOrderService };
