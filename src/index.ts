import "reflect-metadata";
import "dotenv/config";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import cookieParser from "cookie-parser";
import cors from "cors";
// import AuthController from "./controller/AuthController";
// import HomeController from "./controller/HomeController";
import { HomeResolver } from "./resolver/HomeResolver";
import { UserResolver } from "./resolver/UserResolver";

(async () => {
  const app = express();
  app.use(express.urlencoded({ extended: true }));
  app.use(cors({ origin: "http://localhost:3000", credentials: true }));
  app.use(cookieParser());

  app.set("trust proxy", 1); // trust first proxy
  app.disable("x-powered-by");

  app.get("/", (_, res) => res.send("Started..."));
  // app.post("/refresh_token", AuthController.refreshToken);

  await createConnection();

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HomeResolver, UserResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  apolloServer.applyMiddleware({ app, cors: false });

  const port = 4000;
  app.listen(port, () => {
    console.log("Server started...");
    console.log(
      "Now browse to http://localhost:" + port + apolloServer.graphqlPath
    );
  });
})();

// createConnection().then(async connection => {

//     console.log("Inserting a new user into the database...");
//     const user = new User();
//     user.firstName = "Timber";
//     user.lastName = "Saw";
//     user.age = 25;
//     await connection.manager.save(user);
//     console.log("Saved a new user with id: " + user.id);

//     console.log("Loading users from the database...");
//     const users = await connection.manager.find(User);
//     console.log("Loaded users: ", users);

//     console.log("Here you can setup and run express/koa/any other framework.");

// }).catch(error => console.log(error));
