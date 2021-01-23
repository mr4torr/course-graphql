import { Request, Response } from "express";

export type PayloadType = {
  userId: string;
  tokenVersion?: number;
};

export interface MyContext {
  req: Request;
  res: Response;
  payload?: PayloadType;
}
