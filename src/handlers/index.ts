import { Request, Response } from "express";

export default function(request: Request, response: Response) {
  response.status(200).json("Hello, humans!");
};
