import { Router } from "express";
import { CreateUserController } from "./controllers/user/CreateUserController";
import { AuthUserController } from "./controllers/user/AuthUserController";
import { RefreshTokenController } from "./controllers/user/RefreshTokenController";
import { LogoutController } from "./controllers/user/LogoutController";
import { DetailUserController } from "./controllers/user/DetailUserController";
import { validateSchema } from "./middlewares/validateSchema";
import { isAuthenticated } from "./middlewares/isAuthenticated";
import {
  loginRateLimiter,
  refreshRateLimiter,
} from "./middlewares/rateLimiter";
import {
  createUserSchema,
  authenticateUserSchema,
  refreshTokenSchema,
} from "./schemas/userSchemas";

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

export { router };
