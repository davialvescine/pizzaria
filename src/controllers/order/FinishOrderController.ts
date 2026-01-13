import { Request, Response } from "express";
import { FinishOrderService } from "../../services/order/FinishOrderService";

class FinishOrderController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] FinishOrderController - Finalizando pedido...");

    const { order_id } = req.body;

    const finishOrderService = new FinishOrderService();

    const order = await finishOrderService.execute({ order_id });

    console.log("[CONTROLLER] Pedido finalizado!");

    return res.json(order);
  }
}

export { FinishOrderController };
