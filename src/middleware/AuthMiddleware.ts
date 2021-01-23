import { verify } from "jsonwebtoken";
import { MiddlewareFn } from "type-graphql";
import { MyContext, PayloadType } from "../MyContext";

export const AuthMiddleware: MiddlewareFn<MyContext> = ({ context }, next) => {
  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("Not Authenticated");
  }

  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, process.env.ACCESS_TOKEN!);
    context.payload = payload as PayloadType;
  } catch (err) {
    console.log(err);
    throw new Error("Not Authenticated");
  }

  return next();
};
