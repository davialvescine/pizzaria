import { Request, Response } from "express";
import { CreateOrderService } from "../../services/order/CreateOrderService";

class CreateOrderController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] CreateOrderController - Criando pedido...");

    const { table, name } = req.body;

    const createOrderService = new CreateOrderService();

    const order = await createOrderService.execute({ table, name });

    console.log("[CONTROLLER] Pedido criado com sucesso!");

    return res.status(201).json(order);
  }
}

export { CreateOrderController };
