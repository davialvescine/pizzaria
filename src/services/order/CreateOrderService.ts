import { prisma } from "../../prisma";

interface CreateOrderProps {
  table: number;
  name?: string;
}

class CreateOrderService {
  async execute({ table, name }: CreateOrderProps) {
    console.log("[SERVICE] CreateOrderService - Criando pedido...");
    console.log("[SERVICE] Mesa:", table, "| Nome:", name || "Nao informado");

    const order = await prisma.order.create({
      data: {
        table,
        name: name || null,
        draft: true,
        status: false,
        total: 0,
      },
    });

    console.log("[SERVICE] Pedido criado com sucesso! ID:", order.id);

    return order;
  }
}

export { CreateOrderService };
