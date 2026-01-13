import { Request, Response } from "express";
import { AddItemService } from "../../services/order/AddItemService";

class AddItemController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] AddItemController - Adicionando item...");

    const { order_id, product_id, amount } = req.body;

    const addItemService = new AddItemService();

    const item = await addItemService.execute({ order_id, product_id, amount });

    console.log("[CONTROLLER] Item adicionado com sucesso!");

    return res.status(201).json(item);
  }
}

export { AddItemController };
