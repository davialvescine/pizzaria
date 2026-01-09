import { Request, Response } from "express";
import { CreateCategoryService } from "../../services/category/CreateCategoryService";

class CreateCategoryController {
  async handle(req: Request, res: Response) {
    // 1. Pega o nome do body (pedido do cliente)
    const { name } = req.body;

    console.log("[POST /category] Criando categoria:", name);

    // 2. Cria instância do service (chama o cozinheiro)
    const createCategoryService = new CreateCategoryService();

    // 3. Executa a lógica (manda cozinhar)
    const category = await createCategoryService.execute({ name });

    console.log("[POST /category] Categoria criada com sucesso:", name);

    // 4. Retorna resposta (entrega o prato)
    return res.status(201).json(category);
  }
}

export { CreateCategoryController };
