import { Ctx, Query, Resolver, UseMiddleware } from "type-graphql";
import User from "../entity/User";
import { MyContext } from "../MyContext";
import { AuthMiddleware } from "../middleware/AuthMiddleware";

@Resolver()
export class HomeResolver {
  @Query(() => String)
  hello() {
    return "hi!";
  }

  @Query(() => String)
  @UseMiddleware(AuthMiddleware)
  bye(@Ctx() { payload }: MyContext) {
    return `your user id is: ${payload!.userId}`;
  }

  @Query(() => [User])
  @UseMiddleware(AuthMiddleware)
  users() {
    return User.find();
  }
}
