import {
  Arg,
  Ctx,
  Field,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import User from "../entity/User";
import { hash, compare } from "bcryptjs";
import { MyContext } from "../MyContext";
import AuthService from "../service/AuthService";
import { AuthMiddleware } from "../middleware/AuthMiddleware";
import { getConnection } from "typeorm";

@ObjectType()
class LoginResponse {
  @Field()
  accessToken: string;
}

@ObjectType()
class RefreshTokenResponse {
  @Field()
  status: boolean;

  @Field()
  accessToken: string;
}

@Resolver()
export class UserResolver {
  @Query(() => RefreshTokenResponse)
  async refreshToken(
    @Ctx() { req, res }: MyContext
  ): Promise<RefreshTokenResponse> {
    const token = await AuthService.refreshToken(req, res);

    return {
      status: token !== null,
      accessToken: token || "",
    };
  }

  @Query(() => Boolean)
  @UseMiddleware(AuthMiddleware)
  async revoke(@Ctx() { payload }: MyContext): Promise<boolean> {
    const id = payload?.userId;

    await getConnection()
      .getRepository(User)
      .increment({ id }, "tokenVersion", 1);

    return true;
  }

  @Mutation(() => LoginResponse)
  async login(
    @Arg("email") email: string,
    @Arg("password") password: string,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      throw new Error("Invalid Login");
    }

    const valid = await compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid Login");
    }

    return {
      accessToken: AuthService.createToken(res, user),
    };
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("name") name: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    const hashPassword = await hash(password, 12);

    try {
      await User.insert({
        name,
        email,
        password: hashPassword,
      });
    } catch (err) {
      console.log(err);
      return false;
    }

    return true;
  }
}
