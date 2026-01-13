import { Router } from "express";
import multer from "multer";

// Controllers - User
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { RefreshTokenController } from "./controllers/user/RefreshTokenController";
import { LogoutController } from "./controllers/user/LogoutController";
import { DetailUserController } from "./controllers/user/DetailUserController";

// Controllers - Category
import { CreateCategoryController } from "./controllers/Category/CreateCategoryController";
import { ListCategoriesController } from "./controllers/Category/ListCategoriesController";

// Controllers - Product
import { CreateProductController } from "./controllers/product/CreateProductController";
import { DeleteProductController } from "./controllers/product/DeleteProductController";
import { ListProductsByCategoryController } from "./controllers/product/ListProductsByCategoryController";
import { ListAllProductsController } from "./controllers/product/ListAllProductsController";

// Controllers - Order
import { CreateOrderController } from "./controllers/order/CreateOrderController";
import { AddItemController } from "./controllers/order/AddItemController";
import { RemoveItemController } from "./controllers/order/RemoveItemController";
import { ListOrdersController } from "./controllers/order/ListOrdersController";
import { DetailOrderController } from "./controllers/order/DetailOrderController";
import { SendOrderController } from "./controllers/order/SendOrderController";
import { FinishOrderController } from "./controllers/order/FinishOrderController";
import { DeleteOrderController } from "./controllers/order/DeleteOrderController";

// Middlewares
import { validateSchema } from "./middlewares/validateSchema";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";
import {
  loginRateLimiter,
  refreshRateLimiter,
} from "./middlewares/rateLimiter";

// Schemas - User
import {
  createUserSchema,
  authenticateUserSchema,
  refreshTokenSchema,
} from "./schemas/userSchemas";

// Schemas - Category
import { createCategorySchema } from "./schemas/categorySchemas";

// Schemas - Product
import {
  createProductSchema,
  deleteProductSchema,
  listProductsByCategorySchema,
  listAllProductsSchema,
} from "./schemas/productSchemas";

// Schemas - Order
import {
  createOrderSchema,
  addItemSchema,
  removeItemSchema,
  listOrdersSchema,
  detailOrderSchema,
  sendOrderSchema,
  finishOrderSchema,
  deleteOrderSchema,
} from "./schemas/orderSchemas";

// Config Multer
import uploadConfig from "./config/multer";

const upload = multer(uploadConfig);

const router = Router();

// ===========================================
// ROTAS PÚBLICAS (não precisa de login)
// ===========================================
router.post(
  "/users",
  validateSchema(createUserSchema),
  new CreateUserController().handle
);

// Login com rate limiting (5 tentativas a cada 15 min)
router.post(
  "/session",
  loginRateLimiter,
  validateSchema(authenticateUserSchema),
  new AuthUserController().handle
);

// Refresh com rate limiting (10 tentativas a cada 15 min)
router.post(
  "/refresh",
  refreshRateLimiter,
  validateSchema(refreshTokenSchema),
  new RefreshTokenController().handle
);

// ===========================================
// ROTAS PROTEGIDAS (precisa de login)
// ===========================================
router.get("/me", isAuthenticated, new DetailUserController().handle);
router.post("/logout", isAuthenticated, new LogoutController().handle);

// ===========================================
// ROTAS DE CATEGORIAS
// ===========================================

// Categoria - Criar (apenas ADMIN)
router.post(
  "/category",
  isAuthenticated,
  isAdmin,
  validateSchema(createCategorySchema),
  new CreateCategoryController().handle
);

// Categoria - Listar (qualquer usuario logado)
router.get("/category", isAuthenticated, new ListCategoriesController().handle);

// ===========================================
// ROTAS DE PRODUTOS
// ===========================================

// Produto - Listar todos (qualquer usuario logado)
// Query: ?disabled=false (padrao) ou ?disabled=true
router.get(
  "/products",
  isAuthenticated,
  validateSchema(listAllProductsSchema),
  new ListAllProductsController().handle
);

// Produto - Listar por categoria (qualquer usuario logado)
router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductsByCategorySchema),
  new ListProductsByCategoryController().handle
);

// Produto - Criar (apenas ADMIN)
router.post(
  "/product",
  isAuthenticated,
  isAdmin,
  upload.single("file"),
  validateSchema(createProductSchema),
  new CreateProductController().handle
);

// Produto - Deletar (apenas ADMIN)
router.delete(
  "/product",
  isAuthenticated,
  isAdmin,
  validateSchema(deleteProductSchema),
  new DeleteProductController().handle
);

// ===========================================
// ROTAS DE PEDIDOS
// ===========================================

// Pedido - Criar
router.post(
  "/order",
  isAuthenticated,
  validateSchema(createOrderSchema),
  new CreateOrderController().handle
);

// Pedido - Adicionar item
router.post(
  "/order/add",
  isAuthenticated,
  validateSchema(addItemSchema),
  new AddItemController().handle
);

// Pedido - Remover item
router.delete(
  "/order/remove",
  isAuthenticated,
  validateSchema(removeItemSchema),
  new RemoveItemController().handle
);

// Pedido - Listar todos (com filtro opcional por draft)
router.get(
  "/orders",
  isAuthenticated,
  validateSchema(listOrdersSchema),
  new ListOrdersController().handle
);

// Pedido - Detalhes
router.get(
  "/order/detail",
  isAuthenticated,
  validateSchema(detailOrderSchema),
  new DetailOrderController().handle
);

// Pedido - Enviar para producao
router.put(
  "/order/send",
  isAuthenticated,
  validateSchema(sendOrderSchema),
  new SendOrderController().handle
);

// Pedido - Finalizar
router.put(
  "/order/finish",
  isAuthenticated,
  validateSchema(finishOrderSchema),
  new FinishOrderController().handle
);

// Pedido - Deletar (apenas rascunhos)
router.delete(
  "/order",
  isAuthenticated,
  validateSchema(deleteOrderSchema),
  new DeleteOrderController().handle
);

export { router };
