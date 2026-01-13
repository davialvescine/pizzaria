import { Request, Response } from "express";
import { DetailOrderService } from "../../services/order/DetailOrderService";

class DetailOrderController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] DetailOrderController - Buscando detalhes...");

    const { order_id } = req.query as { order_id: string };

    const detailOrderService = new DetailOrderService();

    const order = await detailOrderService.execute({ order_id });

    console.log("[CONTROLLER] Detalhes retornados com sucesso!");

    return res.json(order);
  }
}

export { DetailOrderController };
