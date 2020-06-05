import { Request, Response } from "express";


/**
 * Хендлер для роута /
 *
 * @export
 * @param {Request} request
 * @param {Response} response
 */
export default function(request: Request, response: Response) {
  response.status(200).json("Hello, humans!");
};
