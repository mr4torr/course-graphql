import { Request, Response } from "express";

const HomeController = {
  index: async (_: Request, res: Response) => {
    res.send("Started...");
  },
};

export default HomeController;
