import { Request, Response } from "express";

export default function (request: Request, response: Response) {
  console.log('END');
  response.status(200).send('ok');
}