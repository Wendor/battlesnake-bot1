import { Request, Response } from "express";
import { GameData, Snake, Move } from "../global";

import { findPath } from "../libs/findPath";
import { performance } from 'perf_hooks';

const directionArrow = {
  up: "↑",
  down: "↓",
  left: "←",
  right: "→"
};

export default function (request: Request, response: Response) {
  const startTime = performance.now();
  const gameData: GameData = request.body;
  //console.log(gameData);


  gameData.self = gameData.snakes.find((snake: Snake) => snake.id == gameData.you);

  const foundMove: Move = findPath(gameData, (gameData.width+gameData.height)*2);
  //console.log(findedMove)
  const move = foundMove && foundMove.direction ? foundMove.direction : "up";

  const workTime = performance.now() - startTime;
  console.log('MOVE: ' + directionArrow[move] + ", " + workTime.toFixed(2) + "ms");
  response.status(200).send({
    move: move
  });
}