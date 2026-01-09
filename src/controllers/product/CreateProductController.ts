import { Request, Response } from "express";
import { CreateProductService } from "../../services/product/CreateProductService";
import { cloudinary } from "../../config/cloudinary";
import sharp from "sharp";
import { UploadApiResponse } from "cloudinary";

class CreateProductController {
  async handle(req: Request, res: Response) {
    console.log("[CONTROLLER] CreateProductController - Criando produto...");

    const { name, description, price, categoryId } = req.body;

    // ===========================================
    // 1. VERIFICAR SE TEM ARQUIVO
    // ===========================================
    if (!req.file) {
      console.log("[CONTROLLER] Erro: Nenhum arquivo enviado");
      return res.status(400).json({ error: "Imagem e obrigatoria" });
    }

    console.log("[CONTROLLER] Arquivo recebido:", req.file.originalname);
    console.log("[CONTROLLER] Tamanho original:", req.file.size, "bytes");

    // ===========================================
    // 2. COMPACTAR IMAGEM COM SHARP
    // ===========================================
    let compressedBuffer: Buffer;

    try {
      console.log("[CONTROLLER] Compactando imagem com Sharp...");

      compressedBuffer = await sharp(req.file.buffer)
        .resize(800, 800, {
          fit: "inside", // Mantem proporcao, max 800x800
          withoutEnlargement: true, // Nao aumenta imagens pequenas
        })
        .jpeg({ quality: 80 }) // Converte pra JPEG, qualidade 80%
        .toBuffer();

      console.log("[CONTROLLER] Imagem compactada:", compressedBuffer.length, "bytes");
    } catch (error) {
      console.log("[CONTROLLER] Erro ao compactar imagem:", error);
      return res.status(500).json({ error: "Erro ao processar imagem" });
    }

    // ===========================================
    // 3. FAZER UPLOAD PARA O CLOUDINARY (STREAM)
    // ===========================================
    let resultUrl = "";

    try {
      console.log("[CONTROLLER] Fazendo upload para Cloudinary...");

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          { folder: "pizzaria" },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        uploadStream.end(compressedBuffer);
      });

      resultUrl = result.secure_url;
      console.log("[CONTROLLER] Upload concluido! URL:", resultUrl);
    } catch (error) {
      console.log("[CONTROLLER] Erro no upload:", error);
      return res.status(500).json({ error: "Erro ao fazer upload da imagem" });
    }

    // ===========================================
    // 4. CRIAR PRODUTO NO BANCO
    // ===========================================
    const createProductService = new CreateProductService();

    const product = await createProductService.execute({
      name,
      description,
      price: Number(price),
      banner: resultUrl,
      categoryId,
    });

    console.log("[CONTROLLER] Produto criado com sucesso!");

    return res.status(201).json(product);
  }
}

export { CreateProductController };
