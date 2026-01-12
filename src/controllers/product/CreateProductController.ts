import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";

class CreateProductController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] CreateProductController - Criando produto...");

    const { name, description, price, categoryId } = req.body;

    if (!req.file) {
      console.log("[CONTROLLER] Erro: Nenhum arquivo enviado");
      return res.status(400).json({ error: "Imagem e obrigatoria" });
    }

    console.log("[CONTROLLER] Arquivo recebido:", req.file.originalname);

    const createProductService = new CreateProductService();

    const product = await createProductService.execute({
      name,
      description,
      price: Number(price),
      category_id: categoryId,
      imageBuffer: req.file.buffer,
      imageName: req.file.originalname,
    });

    console.log("[CONTROLLER] Produto criado com sucesso!");

    return res.status(201).json(product);
  }
}

export { CreateProductController };
