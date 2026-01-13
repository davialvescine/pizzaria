import { Request, Response } from "express";
import { ListAllProductsService } from "../../services/product/ListAllProductsService";

class ListAllProductsController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] ListAllProductsController - Listando produtos...");

    const { disabled } = req.query as { disabled?: string };

    const listAllProductsService = new ListAllProductsService();

    // Converte string para boolean, padrao false
    const disabledFilter = disabled === "true";

    const products = await listAllProductsService.execute({ disabled: disabledFilter });

    console.log("[CONTROLLER] Produtos retornados com sucesso!");

    return res.json(products);
  }
}

export { ListAllProductsController };
