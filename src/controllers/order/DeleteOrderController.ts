import { Request, Response } from "express";
import { DeleteOrderService } from "../../services/order/DeleteOrderService";

class DeleteOrderController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] DeleteOrderController - Deletando pedido...");

    const { order_id } = req.query as { order_id: string };

    const deleteOrderService = new DeleteOrderService();

    const result = await deleteOrderService.execute({ order_id });

    console.log("[CONTROLLER] Pedido deletado!");

    return res.json(result);
  }
}

export { DeleteOrderController };
