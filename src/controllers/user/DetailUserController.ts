import { Request, Response } from "express";
import { DetailUserService } from "../../services/user/DetailUserService";

class DetailUserController {
  async handle(req: Request, res: Response) {
    console.log("[GET /me] Buscando dados do usuário:", req.userId);

    const detailUserService = new DetailUserService();

    const user = await detailUserService.execute(req.userId);

    return res.json(user);
  }
}

export { DetailUserController };
