import { Request, Response } from "express";
import { RefreshTokenService } from "../../services/user/RefreshTokenService";

class RefreshTokenController {
  async handle(req: Request, res: Response) {
    const { refreshToken } = req.body;

    const refreshTokenService = new RefreshTokenService();

    const result = await refreshTokenService.execute({ refreshToken });

    return res.json(result);
  }
}

export { RefreshTokenController };
