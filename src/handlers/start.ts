import { Request, Response } from "express";

const battlesnakeInfo = {
  name: 'Devastator',
  apiversion: '1',
  author: 'Пик Балмера',
  color: '#a9e7ff',
  head_type: 'bendr',
  tail_type: 'small-rattle'
};

export default function (request: Request, response: Response) {
  console.log('START')
  response.status(200).json(battlesnakeInfo);
}