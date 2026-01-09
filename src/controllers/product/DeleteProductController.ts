import { Request, Response } from "express";
import { DeleteProductService } from "../../services/product/DeleteProductService";

class DeleteProductController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] DeleteProductController - Deletando produto...");

    // product_id vem da query string: DELETE /product?product_id=uuid
    const { product_id } = req.query as { product_id: string };

    console.log("[CONTROLLER] Product ID:", product_id);

    const deleteProductService = new DeleteProductService();

    const result = await deleteProductService.execute(product_id);

    console.log("[CONTROLLER] Produto deletado com sucesso!");

    return res.json(result);
  }
}

export { DeleteProductController };
