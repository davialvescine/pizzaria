import { Request, Response } from "express";
import { SendOrderService } from "../../services/order/SendOrderService";

class SendOrderController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] SendOrderController - Enviando pedido...");

    const { order_id } = req.body;

    const sendOrderService = new SendOrderService();

    const order = await sendOrderService.execute({ order_id });

    console.log("[CONTROLLER] Pedido enviado para producao!");

    return res.json(order);
  }
}

export { SendOrderController };
