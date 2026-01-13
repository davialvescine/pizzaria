import { prisma } from "../../prisma";

interface RemoveItemProps {
  item_id: string;
}

class RemoveItemService {
  async execute({ item_id }: RemoveItemProps) {
    console.log("[SERVICE] RemoveItemService - Removendo item...");
    console.log("[SERVICE] Item ID:", item_id);

    // 1. Verificar se o item existe
    const item = await prisma.item.findUnique({
      where: { id: item_id },
      include: { order: true },
    });

    if (!item) {
      console.log("[SERVICE] Erro: Item nao encontrado");
      throw new Error("Item nao encontrado");
    }

    // 2. Verificar se o pedido ainda esta em draft
    if (!item.order.draft) {
      console.log("[SERVICE] Erro: Pedido ja foi enviado, nao pode remover itens");
      throw new Error("Pedido ja foi enviado, nao pode remover itens");
    }

    const orderId = item.orderId;

    // 3. Deletar o item
    await prisma.item.delete({
      where: { id: item_id },
    });

    console.log("[SERVICE] Item removido!");

    // 4. Recalcular total do pedido
    const allItems = await prisma.item.findMany({
      where: { orderId },
      include: { product: true },
    });

    const total = allItems.reduce((acc, item) => {
      return acc + item.amount * item.product.price;
    }, 0);

    await prisma.order.update({
      where: { id: orderId },
      data: { total },
    });

    console.log("[SERVICE] Novo total do pedido:", total);

    return { message: "Item removido com sucesso" };
  }
}

export { RemoveItemService };
