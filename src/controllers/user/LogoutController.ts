import { Request, Response } from "express";
import { LogoutService } from "../../services/user/LogoutService";

class LogoutController {
  async handle(req: Request, res: Response) {
    // ===========================================
    // PEGAR O ID DO USUÁRIO DO TOKEN
    // ===========================================
    // O middleware isAuthenticated já verificou o token
    // e colocou o userId no request
    const userId = req.userId;

    const logoutService = new LogoutService();

    const result = await logoutService.execute({ userId });

    return res.json(result);
  }
}

export { LogoutController };
