import { Request, Response } from "express";


/**
 * Хендлер для роута /end
 *
 * @export
 * @param {Request} request
 * @param {Response} response
 */
export default function (request: Request, response: Response) {
  console.log('END');
  response.status(200).send('ok');
}