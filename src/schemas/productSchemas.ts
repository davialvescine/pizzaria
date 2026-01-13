import { z } from "zod";

// ===========================================
// SCHEMA: CRIAR PRODUTO
// ===========================================
// Valida os dados para criacao de um novo produto
// O arquivo (imagem) e processado pelo Multer antes da validacao
export const createProductSchema = z.object({
  body: z.object({
    name: z
      .string({ error: "Nome do produto e obrigatorio" })
      .min(2, { error: "Nome deve ter pelo menos 2 caracteres" }),

    description: z
      .string({ error: "Descricao e obrigatoria" })
      .min(10, { error: "Descricao deve ter pelo menos 10 caracteres" }),

    // coerce converte string para number (form-data envia tudo como string)
    price: z.coerce
      .number({ error: "Preco deve ser um numero" })
      .positive({ error: "Preco deve ser maior que zero" }),

    categoryId: z
      .string({ error: "ID da categoria e obrigatorio" })
      .uuid({ error: "ID da categoria deve ser um UUID valido" }),
  }),
});

// ===========================================
// SCHEMA: DELETAR PRODUTO
// ===========================================
// Valida o product_id enviado via query string
// Ex: DELETE /product?product_id=uuid-aqui
export const deleteProductSchema = z.object({
  query: z.object({
    product_id: z
      .string({ error: "ID do produto e obrigatorio" })
      .uuid({ error: "ID do produto deve ser um UUID valido" }),
  }),
});

// ===========================================
// SCHEMA: LISTAR PRODUTOS POR CATEGORIA
// ===========================================
// Valida o category_id enviado via query string
// Ex: GET /category/product?category_id=uuid-aqui
export const listProductsByCategorySchema = z.object({
  query: z.object({
    category_id: z
      .string({ error: "ID da categoria e obrigatorio" })
      .uuid({ error: "ID da categoria deve ser um UUID valido" }),
  }),
});

// ===========================================
// SCHEMA: LISTAR TODOS OS PRODUTOS
// ===========================================
// Valida o disabled enviado via query string (opcional)
// Ex: GET /products?disabled=false (padrao: false)
export const listAllProductsSchema = z.object({
  query: z.object({
    disabled: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  }),
});
