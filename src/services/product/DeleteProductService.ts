import { prisma } from "../../prisma";

class DeleteProductService {
  async execute(productId: string) {
    console.log("[SERVICE] DeleteProductService - Iniciando...");
    console.log("[SERVICE] Product ID:", productId);

    // ===========================================
    // 1. VERIFICAR SE O PRODUTO EXISTE
    // ===========================================
    const productExists = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!productExists) {
      console.log("[SERVICE] Erro: Produto nao encontrado");
      throw new Error("Produto nao encontrado");
    }

    console.log("[SERVICE] Produto encontrado:", productExists.name);

    // ===========================================
    // 2. DELETAR O PRODUTO
    // ===========================================
    // Nota: A imagem no Cloudinary permanece (pode ser deletada manualmente)
    // Para deletar do Cloudinary, seria necessario extrair o public_id da URL
    await prisma.product.delete({
      where: { id: productId },
    });

    console.log("[SERVICE] Produto deletado com sucesso!");

    return { message: "Produto deletado com sucesso" };
  }
}

export { DeleteProductService };
