import { Request, Response } from "express";
import { ListProductsByCategoryService } from "../../services/product/ListProductsByCategoryService";

class ListProductsByCategoryController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] ListProductsByCategoryController - Listando produtos...");

    // category_id vem da query string: GET /category/product?category_id=uuid
    const { category_id } = req.query as { category_id: string };

    console.log("[CONTROLLER] Category ID:", category_id);

    const listProductsByCategoryService = new ListProductsByCategoryService();

    const products = await listProductsByCategoryService.execute(category_id);

    console.log("[CONTROLLER] Produtos retornados com sucesso!");

    return res.json(products);
  }
}

export { ListProductsByCategoryController };
