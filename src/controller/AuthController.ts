import AuthService from "../service/AuthService";
import { Request, Response } from "express";

const AuthController = {
  refreshToken: async (req: Request, res: Response) => {
    const token = await AuthService.refreshToken(req, res);

    return res.json({
      status: token !== null,
      accessToken: token || "",
    });
  },
};

export default AuthController;
