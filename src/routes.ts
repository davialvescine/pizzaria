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

// Middlewares
import { validateSchema } from "./middlewares/validateSchema";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import { isAdmin } from "./middlewares/isAdmin";
import {
  loginRateLimiter,
  refreshRateLimiter,
} from "./middlewares/rateLimiter";

// Schemas
import {
  createUserSchema,
  authenticateUserSchema,
  refreshTokenSchema,
} from "./schemas/userSchemas";
import { createCategorySchema } from "./schemas/categorySchemas";
import {
  createProductSchema,
  deleteProductSchema,
  listProductsByCategorySchema,
} from "./schemas/productSchemas";

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

// Produto - Listar por categoria (qualquer usuario logado)
router.get(
  "/category/product",
  isAuthenticated,
  validateSchema(listProductsByCategorySchema),
  new ListProductsByCategoryController().handle
);

export { router };
