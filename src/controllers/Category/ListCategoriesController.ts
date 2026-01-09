import { Request, Response } from "express";
import { ListCategoriesService } from "../../services/category/ListCategoriesService";

class ListCategoriesController {
  async handle(_req: Request, res: Response) {
    console.log(
      "[CONTROLLER] ListCategoriesController - Listando categorias..."
    );

    const listCategoriesService = new ListCategoriesService();

    const categories = await listCategoriesService.execute();

    console.log("[CONTROLLER] Categorias retornadas com sucesso!");

    return res.json(categories);
  }
}

export { ListCategoriesController };
