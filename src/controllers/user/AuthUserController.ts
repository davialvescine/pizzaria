import { Request, Response } from "express";
import { AuthUserService } from "../../services/user/AuthUserService";

class AuthUserController {
  async handle(req: Request, res: Response) {
    const { email, password } = req.body;

    console.log("[POST /session] Tentativa de login:", email);

    const authUserService = new AuthUserService();

    const result = await authUserService.execute({ email, password });

    console.log("[POST /session] Login realizado com sucesso:", email);

    return res.json(result);
  }
}

export { AuthUserController };
