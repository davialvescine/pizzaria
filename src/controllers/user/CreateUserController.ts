import { Request, Response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
  async handle(req: Request, res: Response) {
    const { name, email, password } = req.body;

    console.log("[POST /users] Criando usuário:", email);

    const createUserService = new CreateUserService();

    const user = await createUserService.execute({
      name: name,
      email: email,
      password: password,
    });

    console.log("[POST /users] Usuário criado com sucesso:", email);

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user,
    });
  }
}

export { CreateUserController };
