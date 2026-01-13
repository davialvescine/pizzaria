import { z } from "zod";

// ===========================================
// SCHEMAS DE VALIDACAO - PEDIDOS
// ===========================================

// POST /order - Criar pedido
export const createOrderSchema = z.object({
  body: z.object({
    table: z.coerce
      .number({ message: "Numero da mesa e obrigatorio" })
      .int({ message: "Numero da mesa deve ser inteiro" })
      .positive({ message: "Numero da mesa deve ser positivo" }),
    name: z.string().optional(),
  }),
});

// POST /order/add - Adicionar item ao pedido
export const addItemSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "ID do pedido e obrigatorio" })
      .uuid({ message: "ID do pedido deve ser um UUID valido" }),
    product_id: z
      .string({ message: "ID do produto e obrigatorio" })
      .uuid({ message: "ID do produto deve ser um UUID valido" }),
    amount: z.coerce
      .number({ message: "Quantidade e obrigatoria" })
      .int({ message: "Quantidade deve ser inteiro" })
      .positive({ message: "Quantidade deve ser positiva" }),
  }),
});

// DELETE /order/remove - Remover item do pedido
export const removeItemSchema = z.object({
  query: z.object({
    item_id: z
      .string({ message: "ID do item e obrigatorio" })
      .uuid({ message: "ID do item deve ser um UUID valido" }),
  }),
});

// GET /orders - Listar pedidos
export const listOrdersSchema = z.object({
  query: z.object({
    draft: z
      .string()
      .transform((val) => val === "true")
      .optional(),
  }),
});

// GET /order/detail - Detalhes do pedido
export const detailOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "ID do pedido e obrigatorio" })
      .uuid({ message: "ID do pedido deve ser um UUID valido" }),
  }),
});

// PUT /order/send - Enviar pedido para producao
export const sendOrderSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "ID do pedido e obrigatorio" })
      .uuid({ message: "ID do pedido deve ser um UUID valido" }),
  }),
});

// PUT /order/finish - Finalizar pedido
export const finishOrderSchema = z.object({
  body: z.object({
    order_id: z
      .string({ message: "ID do pedido e obrigatorio" })
      .uuid({ message: "ID do pedido deve ser um UUID valido" }),
  }),
});

// DELETE /order - Deletar pedido
export const deleteOrderSchema = z.object({
  query: z.object({
    order_id: z
      .string({ message: "ID do pedido e obrigatorio" })
      .uuid({ message: "ID do pedido deve ser um UUID valido" }),
  }),
});
