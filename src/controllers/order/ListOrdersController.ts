import { Request, Response } from "express";
import { ListOrdersService } from "../../services/order/ListOrdersService";

class ListOrdersController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] ListOrdersController - Listando pedidos...");

    const { draft } = req.query as { draft?: string };

    const listOrdersService = new ListOrdersService();

    // Converte string para boolean se existir
    const draftFilter = draft !== undefined ? draft === "true" : undefined;

    const orders = await listOrdersService.execute({ draft: draftFilter });

    console.log("[CONTROLLER] Pedidos retornados com sucesso!");

    return res.json(orders);
  }
}

export { ListOrdersController };
