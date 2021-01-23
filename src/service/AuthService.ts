import { sign, verify } from "jsonwebtoken";
import User from "../entity/User";

import { PayloadType } from "../MyContext";
import { Request, Response } from "express";

class AuthService {
  private createAccessToken = (user: User): string => {
    return this.getToken(user, process.env.ACCESS_TOKEN!, "15m", {});
  };

  private createRefreshToken = (user: User): string => {
    return this.getToken(user, process.env.REFRESH_TOKEN!, "7d", {
      tokenVersion: user.tokenVersion,
    });
  };

  private getToken = (
    user: User,
    secret: string,
    expiresIn: string,
    params = {}
  ) => {
    return sign({ ...params, userId: user.id }, secret, {
      expiresIn,
    });
  };

  public createToken = (res: Response, user: User): string => {
    res.cookie("secret", this.createRefreshToken(user), {
      httpOnly: true,
      // path: "/refresh_token",
    });

    return this.createAccessToken(user);
  };

  public refreshToken = async (
    req: Request,
    res: Response
  ): Promise<string | null> => {
    const token = req.cookies.secret;
    if (!token) {
      return null;
    }

    let payload: PayloadType;
    try {
      payload = verify(token, process.env.REFRESH_TOKEN!) as PayloadType;
    } catch {
      return null;
    }

    const user = await User.findOne({ id: payload.userId });

    if (!user) {
      return null;
    }

    if (payload.tokenVersion !== user.tokenVersion) {
      return null;
    }

    return this.createToken(res, user);
  };
}

export default new AuthService();
