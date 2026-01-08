import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  async handle(req: Request, res: Response) {
    try {
      // Pega o ID do usuário do token (definido pelo isAuthenticated)
      const userId = req.userId;

      console.log("=== DEBUG DetailUserController ===");
      console.log("userId:", userId);

      const detailUserService = new DetailUserService();

      const user = await detailUserService.execute(userId);

      console.log("user encontrado:", user);

      return res.json(user);
    } catch (error) {
      console.log("=== ERRO DetailUserController ===");
      console.log(error);
      return res.status(400).json({ error: (error as Error).message });
    }
  }
}

export { DetailUserController };
