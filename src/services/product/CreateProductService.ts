import { prisma } from "../../prisma";
import { cloudinary } from "../../config/cloudinary";
import sharp from "sharp";
import { UploadApiResponse } from "cloudinary";

interface CreateProductServiceProps {
  name: string;
  price: number;
  description: string;
  category_id: string;
  imageBuffer: Buffer;
  imageName: string;
}

class CreateProductService {
  async execute({
    name,
    price,
    description,
    category_id,
    imageBuffer,
    imageName,
  }: CreateProductServiceProps) {
    console.log("[SERVICE] CreateProductService - Iniciando...");
    console.log("[SERVICE] Dados recebidos:", { name, description, price, category_id, imageName });

    // ===========================================
    // 1. VERIFICAR SE A CATEGORIA EXISTE
    // ===========================================
    const categoryExists = await prisma.category.findUnique({
      where: { id: category_id },
    });

    if (!categoryExists) {
      console.log("[SERVICE] Erro: Categoria nao encontrada");
      throw new Error("Categoria nao encontrada");
    }

    console.log("[SERVICE] Categoria encontrada:", categoryExists.name);

    // ===========================================
    // 2. COMPACTAR IMAGEM COM SHARP
    // ===========================================
    console.log("[SERVICE] Compactando imagem com Sharp...");
    console.log("[SERVICE] Tamanho original:", imageBuffer.length, "bytes");

    let compressedBuffer: Buffer;

    try {
      compressedBuffer = await sharp(imageBuffer)
        .resize(800, 800, {
          fit: "inside",
          withoutEnlargement: true,
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      console.log("[SERVICE] Imagem compactada:", compressedBuffer.length, "bytes");
    } catch (error) {
      console.log("[SERVICE] Erro ao compactar imagem:", error);
      throw new Error("Erro ao processar imagem");
    }

    // ===========================================
    // 3. FAZER UPLOAD PARA O CLOUDINARY
    // ===========================================
    console.log("[SERVICE] Fazendo upload para Cloudinary...");

    let uploadResult: UploadApiResponse;

    try {
      uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "pizzaria/products",
            resource_type: "image",
            public_id: `${Date.now()}-${imageName.split(".")[0].replace(/[^a-zA-Z0-9]/g, "_")}`,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        );
        uploadStream.end(compressedBuffer);
      });

      console.log("[SERVICE] Upload concluido! URL:", uploadResult.secure_url);
    } catch (error) {
      console.log("[SERVICE] Erro no upload para Cloudinary:", error);
      throw new Error("Erro ao fazer upload da imagem");
    }

    // ===========================================
    // 4. CRIAR O PRODUTO NO BANCO
    // ===========================================
    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        banner: uploadResult.secure_url,
        categoryId: category_id,
      },
    });

    console.log("[SERVICE] Produto criado com sucesso! ID:", product.id);

    return product;
  }
}

export { CreateProductService };
