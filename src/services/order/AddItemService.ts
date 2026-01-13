import { prisma } from "../../prisma";

interface AddItemProps {
  order_id: string;
  product_id: string;
  amount: number;
}

class AddItemService {
  async execute({ order_id, product_id, amount }: AddItemProps) {
    console.log("[SERVICE] AddItemService - Adicionando item ao pedido...");
    console.log("[SERVICE] Order:", order_id, "| Product:", product_id, "| Amount:", amount);

    // 1. Verificar se o pedido existe e esta em draft
    const order = await prisma.order.findUnique({
      where: { id: order_id },
    });

    if (!order) {
      console.log("[SERVICE] Erro: Pedido nao encontrado");
      throw new Error("Pedido nao encontrado");
    }

    if (!order.draft) {
      console.log("[SERVICE] Erro: Pedido ja foi enviado, nao pode adicionar itens");
      throw new Error("Pedido ja foi enviado, nao pode adicionar itens");
    }

    // 2. Verificar se o produto existe e nao esta desabilitado
    const product = await prisma.product.findUnique({
      where: { id: product_id },
    });

    if (!product) {
      console.log("[SERVICE] Erro: Produto nao encontrado");
      throw new Error("Produto nao encontrado");
    }

    if (product.disabled) {
      console.log("[SERVICE] Erro: Produto esta desabilitado");
      throw new Error("Produto esta desabilitado");
    }

    // 3. Verificar se ja existe item com mesmo produto no pedido
    const existingItem = await prisma.item.findFirst({
      where: {
        orderId: order_id,
        productId: product_id,
      },
    });

    let item;

    if (existingItem) {
      // Atualiza quantidade do item existente
      console.log("[SERVICE] Item ja existe, atualizando quantidade...");
      item = await prisma.item.update({
        where: { id: existingItem.id },
        data: {
          amount: existingItem.amount + amount,
        },
      });
    } else {
      // Cria novo item
      console.log("[SERVICE] Criando novo item...");
      item = await prisma.item.create({
        data: {
          orderId: order_id,
          productId: product_id,
          amount,
        },
      });
    }

    // 4. Recalcular total do pedido
    const allItems = await prisma.item.findMany({
      where: { orderId: order_id },
      include: { product: true },
    });

    const total = allItems.reduce((acc, item) => {
      return acc + item.amount * item.product.price;
    }, 0);

    await prisma.order.update({
      where: { id: order_id },
      data: { total },
    });

    console.log("[SERVICE] Item adicionado! Novo total do pedido:", total);

    return item;
  }
}

export { AddItemService };
