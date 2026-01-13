import { Request, Response } from "express";
import { RemoveItemService } from "../../services/order/RemoveItemService";

class RemoveItemController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] RemoveItemController - Removendo item...");

    const { item_id } = req.query as { item_id: string };

    const removeItemService = new RemoveItemService();

    const result = await removeItemService.execute({ item_id });

    console.log("[CONTROLLER] Item removido com sucesso!");

    return res.json(result);
  }
}

export { RemoveItemController };
