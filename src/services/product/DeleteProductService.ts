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

    if (productExists.disabled) {
      console.log("[SERVICE] Erro: Produto ja esta desabilitado");
      throw new Error("Produto ja esta desabilitado");
    }

    console.log("[SERVICE] Produto encontrado:", productExists.name);

    // ===========================================
    // 2. SOFT DELETE - DESABILITAR O PRODUTO
    // ===========================================
    // Em vez de deletar, marcamos como disabled: true
    // Assim o produto pode ser recuperado depois se necessario
    const product = await prisma.product.update({
      where: { id: productId },
      data: { disabled: true },
    });

    console.log("[SERVICE] Produto desabilitado com sucesso!");

    return { message: "Produto desabilitado com sucesso", product };
  }
}

export { DeleteProductService };
